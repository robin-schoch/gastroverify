import {Router} from 'express';
import {createLogger} from 'bunyan';
import {switchMap} from 'rxjs/operators';
import {isNotDynamodbError} from '../util/dynamoDbDriver';
import {locationStorage} from '../db/locationStorage';
import {of, throwError} from 'rxjs';
import {Entry} from '../domain/entry';
import {CheckIn} from '../domain/checkIn';

const jwt = require('jsonwebtoken');
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


/***************************************************************************
 *                                                                         *
 * Custom add person                                                       *
 *                                                                         *
 **************************************************************************/

router.post('/:id/location/:locationId/visitor', ((req, res) => {
  entrystorage.createEntry(CheckIn.fromReq(req)).subscribe(elem => {
        res.json(elem);
      },
      error => {
        res.status(500);
        res.json({error: 'error'});
      }
  );
}));
// 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime'

// corona alarm

router.get('/:barId/coronaalarm', (req, res) => {
  // @ts-ignore
  locationstorage.findLocation(req.xUser.email, req.params.barId)
                 .pipe(switchMap(location =>
                     entrystorage.getQuarantine(location, req.query.time, req.query.firstName, req.query.lastName, req.query.phoneNumber)
                 ))
                 .subscribe((elem: Entry[]) => {
                       console.log(elem.length);
                       res.json({
                         foundSubjects: elem.length
                       });
                     },
                     error => res.json(error)
                 );
});


router.get('/:barId', (req: any, res) => {
      locationstorage.findLocation(req.xUser.email, req.params.barId)
                     .pipe(switchMap(a => entrystorage.findPaged(
                         a.locationId,
                         req.query.Limit ? req.query.Limit : 10,
                         req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
                         ))
                     ).subscribe((entries) => {
            res.json(entries);
          }, error => {
            res.status(500);
            res.json(error);
          }
      );
    }
);

router.get(':id/location/:locationId/counter', (req: any, res) => {
  locationstorage.findLocation(req.xUser.email, req.params.locationId)
                 .pipe(switchMap(l => entrystorage.getEntryCount(l.locationId, !!req.query.hours ?
                                                                               req.query.hours :
                                                                               5)))
                 .subscribe(count => {
                       res.json({
                         in: count[0],
                         out: count[1],
                         counter: count[0] - count[1]
                       });
                     },
                     error => {
                       res.status(500);
                       res.json(error);
                     });
});

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


router.get('/:barId/export', (req: any, res) => {
      locationstorage
          .findLocation(req.xUser.email, req.params.barId)
          .subscribe(
              async (location) => {
                if (location !== null) {
                  let lastKey = null;
                  let data = [];
                  do {
                    const entries = await entrystorage.findPaged(
                        location.locationId,
                        50000,
                        lastKey
                    ).pipe(switchMap((b) => isNotDynamodbError<any>(b) ? of(b) : throwError(b))).toPromise();
                    /* const entries = await getEntries(
                     location.locationId,
                     5000,
                     lastKey
                     );*/
                    // 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn,
                    // birthdate, tableNumber',
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


