"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bunyan_1 = require("bunyan");
const operators_1 = require("rxjs/operators");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const locationStorage_1 = require("../db/locationStorage");
const rxjs_1 = require("rxjs");
const jwt = require('jsonwebtoken');
const { partnerStorage } = require('../db/partnerStorage');
const { getEntries, entryStorage } = require('../db/entryStorage');
const { parse } = require('json2csv');
const log = bunyan_1.createLogger({ name: 'entryRoute', src: true });
exports.router = express_1.Router();
const storage = new partnerStorage();
const entrystorage = new entryStorage();
const locationstorage = new locationStorage_1.locationStorage();
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
exports.router.get('/:barId', (req, res) => {
    locationstorage.findLocation(req.xUser.email, req.params.barId).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? entrystorage.findPaged(a.locationId, req.query.Limit ? req.query.Limit : 10, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null) : rxjs_1.throwError(a)), operators_1.switchMap(b => dynamoDbDriver_1.isNotDynamodbError(b) ? rxjs_1.of(b) : rxjs_1.throwError(b))).subscribe((entries) => {
        res.json(entries);
    }, error => {
        res.status(500);
        res.json(error);
    });
});
const downloadResource = (res, fileName, fields, data) => {
    const csv = parse(data, { fields });
    log.info('created csv');
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    res.send(csv);
};
exports.router.get('/:barId/export', (req, res) => {
    locationstorage.findLocation(
    // @ts-ignore
    req.xUser.email, req.params.barId).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe(async (location) => {
        if (location !== null) {
            let lastKey = null;
            let data = [];
            do {
                const entries = await entrystorage.findPaged(location.locationId, 50000, lastKey).pipe(operators_1.switchMap((b) => dynamoDbDriver_1.isNotDynamodbError(b) ? rxjs_1.of(b) : rxjs_1.throwError(b))).toPromise();
                /* const entries = await getEntries(
                     location.locationId,
                     5000,
                     lastKey
                 );*/
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
            downloadResource(res, 'besucherliste.csv', fields, data);
        }
    });
});
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
