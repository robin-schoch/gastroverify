"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const rxjs_1 = require("rxjs");
const partner_1 = require("../domain/partner");
const bunyan_1 = require("bunyan");
const qrCodeMappingStorage_1 = require("../db/qrCodeMappingStorage");
const partnerStorage_1 = require("../db/partnerStorage");
const locationStorage_1 = require("../db/locationStorage");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const qrCodeMapping_1 = require("../domain/qrCodeMapping");
const operators_1 = require("rxjs/operators");
const log = bunyan_1.createLogger({ name: 'partnerRoute', src: true });
const storage = new partnerStorage_1.partnerStorage();
const locationstorage = new locationStorage_1.locationStorage();
const mappingStorage = new qrCodeMappingStorage_1.QrCodeMappingStorage();
exports.router = express_1.Router();
exports.router.get('/', (req, res) => {
    // @ts-ignore
    rxjs_1.forkJoin([
        storage.findPartner(req.xUser.email).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))),
        locationstorage.findLocations(req.xUser.email).pipe(operators_1.switchMap(inner => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner))),
    ]).subscribe(([partner, locations]) => {
        partner.locations = locations.Data;
        log.info(locations);
        res.json(partner);
    }, error => {
        log.error(error);
        res.status(500);
        res.json(error);
    });
});
exports.router.get('/:id', (req, res) => {
    rxjs_1.forkJoin([
        storage.findPartner(req.xUser.email).pipe(operators_1.switchMap(inner => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner))),
        locationstorage.findLocations(req.xUser.email).pipe(operators_1.switchMap(inner => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner))),
    ]).subscribe(([partner, locations]) => {
        partner.locations = locations.Data;
        log.info(locations);
        res.json(partner);
    }, error => {
        log.error(error);
        res.status(500);
        res.json(error);
    });
});
exports.router.post('/:id/bar', (req, res) => {
    const location = partner_1.Location.fromRequest(req);
    log.info(location);
    if (!location.locationId) {
        res.status(409);
        res.json(location);
    }
    rxjs_1.forkJoin([
        locationstorage.createLocation(location),
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, location.partnerId, true)),
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, location.partnerId, false))
    ]).pipe(operators_1.switchMap(([partner, qr1, qr2]) => {
        if (!dynamoDbDriver_1.isNotDynamodbError(partner))
            return rxjs_1.throwError(partner);
        if (!dynamoDbDriver_1.isNotDynamodbError(qr1))
            return rxjs_1.throwError(qr1);
        if (!dynamoDbDriver_1.isNotDynamodbError(qr2))
            return rxjs_1.throwError(qr2);
        return rxjs_1.of(location);
    })).subscribe((location) => {
        res.json(location);
    }, (error) => {
        res.status(500);
        res.json(error);
    });
});
exports.router.delete('/:id/bar/:barId', (req, res) => {
    locationstorage.changeActivateLocation(
    // @ts-ignore
    req.xUser.email, req.params.barId, false).pipe(operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner)), operators_1.mergeMap((location) => rxjs_1.forkJoin([
        mappingStorage.deleteMapping(location.checkInCode).pipe(operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(inner))),
        mappingStorage.deleteMapping(location.checkOutCode).pipe(operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(inner))),
        rxjs_1.of(location)
    ]))).subscribe(([qr1, qr2, location]) => {
        res.json(location);
    });
});
exports.router.post('/', (req, res) => {
    storage.createPartner(partner_1.Partner.fromRequest(req)).subscribe(success => {
        res.json(success);
    });
});
