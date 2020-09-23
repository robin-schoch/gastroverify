import {Router} from 'express';
import {createLogger} from 'bunyan';
import {switchMap} from 'rxjs/operators';
import {isNotDynamodbError} from '../util/dynamoDbDriver';
import {Location} from '../domain/partner';
import {locationStorage} from '../db/locationStorage';
import {of, throwError} from 'rxjs';

const jwt = require('jsonwebtoken');
const {getGastro} = require('../db/gastroStorage');
const {partnerStorage} = require('../db/partnerStorage');
const {getEntries, entryStorage} = require('../db/entryStorage');
const {parse} = require('json2csv');

const log = createLogger({name: 'entryRoute', src: true});
export const router = Router();

const storage = new partnerStorage();
const entrystorage = new entryStorage();
const locationstorage = new locationStorage();

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

];
// 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime'

router.get(
    '/:barId',
    (req: any, res) => {

        locationstorage.findLocation(
            req.xUser.email,
            req.params.barId
        ).pipe(
            switchMap(a => isNotDynamodbError<Location>(a) ? entrystorage.findPaged(
                a.locationId,
                req.query.Limit ? req.query.Limit : 10,
                req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
            ) : throwError(a)),
            switchMap(b => isNotDynamodbError<any>(b) ? of(b) : throwError(b))
        ).subscribe(
            (entries) => {
                res.json(entries);
            },
            error => {
                res.status(500);
                res.json(error);
            }
        );
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

        locationstorage.findLocation(
            // @ts-ignore
            req.xUser.email,
            req.params.barId
        ).pipe(
            switchMap(a => isNotDynamodbError<Location>(a) ? of(a) : throwError(a)),
        ).subscribe(async (location) => {
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
                } while (!!lastKey);
                log.info('csv is ' + data.length + ' elements long');
                fields.push({
                    label: location.type,
                    value: 'tableNumber'
                });
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
            tableNumber: values.tableNumber === -1 ? 'Keine Angabe' : values.tableNumber,
            type: !!values.type ? values.type : 'Tisch'
        };
    });
};
