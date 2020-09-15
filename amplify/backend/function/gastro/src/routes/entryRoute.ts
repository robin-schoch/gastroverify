import {Router} from 'express';
import {createLogger} from 'bunyan';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNotDynamodbError} from '../util/dynamoDbDriver';

const jwt = require('jsonwebtoken');
const {getGastro} = require('../db/gastroStorage');
const {partnerStorage} = require('../db/partnerStorage');
const {getEntries, entryStorage} = require('../db/entryStorage');
const {parse} = require('json2csv');

const log = createLogger({name: 'entryRoute', src: true});
export const router = Router();

const storage = new partnerStorage();
const entrystorage = new entryStorage();

const fields = [
    {
        label: 'Vorname',
        value: 'firstName'
    },
    {
        label: 'Nachname',
        value: 'lastName'
    },
    {
        label: 'Strasse',
        value: 'street'
    },
    {
        label: 'Ort',
        value: 'city'
    },
    {
        label: 'PLZ',
        value: 'zipCode'
    },
    {
        label: 'Email',
        value: 'email'
    },
    {
        label: 'Handynummer',
        value: 'phoneNumber'
    },
    {
        label: 'Zeit',
        value: 'entryTime'
    },
    {
        label: 'Geburtstag',
        value: 'birthdate'
    },
    {
        label: 'Status',
        value: 'checkIn'
    },
    {
        label: 'Tisch',
        value: 'tableNumber'
    }
];
// 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime'

router.get(
    '/:barId',
    (req, res) => {
        // @ts-ignore
        log.info(req.xUser);
        // @ts-ignore
        storage.findPartner(req.xUser.email).pipe(
            filter(isNotDynamodbError),
            // @ts-ignore
            map(partner => partner.locations.filter(l => l.locationId === req.params.barId)[0]),

            mergeMap(location => entrystorage.findPaged(
                // @ts-ignore
                location.locationId,
                req.query.Limit ? req.query.Limit : 10,
                // @ts-ignore
                req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
            ))
        ).subscribe(elem => {
            if (!isNotDynamodbError(elem)) {
                log.error(elem);
                res.status(500);
            }
            res.json(elem);
        });
        /*
         getGastro(req.xUser.email).then(user => {
         const location = user.locations.filter(l => l.locationId === req.params.barId)[0];
         if (location !== null) {
         // @ts-ignore
         getEntries(
         location.locationId,
         req.query.Limit ? req.query.Limit : 10,
         req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
         )
         .then(elems => {
         res.json(elems);
         }).catch(error => {
         log.error(error);
         res.status(503);
         res.json({error: 'oh boy'});
         });
         } else {
         res.status(401);
         res.json({barid: req.params.barId, bars: user.bars, cond: !!location, location: location});
         }

         }).catch(error => {
         log.error(error);
         res.status(404);
         res.json(error);
         });*/
    }
);

const downloadResource = (res, fileName, fields, data) => {
    const csv = parse(
        data,
        {fields}
    );
    log.info('created csv');

    res.header(
        'Content-Type',
        'text/csv'
    );
    res.attachment(fileName);
    res.send(csv);
};


router.get(
    '/:barId/export',
    (req, res) => {

        /*
         // @ts-ignore
         storage.findPartner(req.xUser.email).pipe(
         filter(isNotDynamodbError),
         // @ts-ignore
         map(partner => partner.locations.filter(l => l.locationId === req.params.barId)[0]),
         )
         */
        // @ts-ignore
        getGastro(req.xUser.email).then(async (user) => {
            const location = user.locations.filter(l => l.locationId === req.params.barId)[0];
            if (location !== null) {
                let lastKey = null;
                let data = [];
                do {
                    const entries = await getEntries(
                        location.locationId,
                        5000,
                        lastKey
                    );
                    // 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate,
                    // tableNumber',
                    const mappedValues = mapEntries(entries.Data);
                    data = [
                        ...data,
                        ...mappedValues
                    ];
                    lastKey = entries.LastEvaluatedKey;
                }
                while (!!lastKey);
                log.info('csv is ' + data.length + ' elements long');
                downloadResource(
                    res,
                    'besucherliste.csv',
                    fields,
                    data
                );
            }
        });
    }
);

const mapEntries = (data) => {
    return data.map(values => {
        return {
            firstName: values.firstName,
            lastName: values.lastName,
            street: values.street,
            city: values.city,
            zipCode: values.zipCode,
            email: !!values.email ? values.email : 'Keine Email',
            phoneNumber: values.phoneNumber,
            entryTime: values.entryTime,
            checkIn: values.checkIn ? 'Standort betreten' : 'Standort verlassen',
            birthdate: values.birthdate,
            tableNumber: values.tableNumber === -1 ? 'Kein Tisch' : values.tableNumber

        };
    });
};