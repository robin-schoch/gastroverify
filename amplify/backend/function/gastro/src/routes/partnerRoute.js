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
const RequestError_1 = require("../domain/RequestError");
const log = bunyan_1.createLogger({ name: 'partnerRoute', src: true });
const storage = new partnerStorage_1.partnerStorage();
const locationstorage = new locationStorage_1.locationStorage();
const mappingStorage = new qrCodeMappingStorage_1.QrCodeMappingStorage();
exports.router = express_1.Router();
exports.router.get('/', (req, res) => {
    // @ts-ignore
    rxjs_1.forkJoin([
        storage.findPartner(req.xUser.email)
            .pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))),
        locationstorage.findLocations(req.xUser.email).pipe(operators_1.switchMap(inner => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner))),
    ]).subscribe(([partner, locations]) => {
        partner.locations = locations.Data;
        log.info(locations);
        res.json(partner);
    }, error => handleError(res, error));
});
exports.router.get('/:id', (req, res) => {
    rxjs_1.forkJoin([
        storage.findPartner(req.xUser.email),
        locationstorage.findLocations(req.xUser.email)
    ]).pipe(operators_1.switchMap(([partner, loc]) => {
        if (!dynamoDbDriver_1.isNotDynamodbError(partner))
            return rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal service', partner));
        if (!dynamoDbDriver_1.isNotDynamodbError(loc))
            return rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal service', loc));
        if (!partner)
            return rxjs_1.throwError(RequestError_1.RequestError.create(404, 'partner not found'));
        return rxjs_1.of([partner, loc]);
    })).subscribe(([partner, locations]) => {
        partner.locations = locations.Data;
        log.info(locations);
        res.json(partner);
    }, error => handleError(res, error));
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
            return rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal service', partner));
        if (!dynamoDbDriver_1.isNotDynamodbError(qr1))
            return rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal service', qr1));
        if (!dynamoDbDriver_1.isNotDynamodbError(qr2))
            return rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal service', qr2));
        return rxjs_1.of(location);
    })).subscribe((location) => {
        log.info(location);
        res.json(location);
    }, error => handleError(res, error));
});
exports.router.delete('/:id/bar/:barId', (req, res) => {
    locationstorage.changeActivateLocation(
    // @ts-ignore
    req.xUser.email, req.params.barId, false).pipe(
    // tap(elem => log.info(elem)),
    operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner)), operators_1.mergeMap((location) => rxjs_1.forkJoin([
        mappingStorage.deleteMapping(location.checkInCode).pipe(operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal error', inner)))),
        mappingStorage.deleteMapping(location.checkOutCode).pipe(operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal error', inner)))),
        rxjs_1.of(location)
    ]))).subscribe(([qr1, qr2, location]) => res.json(location), error => handleError(res, error));
});
exports.router.put('/:id/bar/:barId', (req, res) => {
    log.info({ a: req.xUser.email, B: req.params.barId, x: true });
    // @ts-ignore
    locationstorage.changeActivateLocation(req.xUser.email, req.params.barId, true).pipe(operators_1.tap(elem => log.info(elem)), operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ? rxjs_1.of(inner) : rxjs_1.throwError(inner)), operators_1.mergeMap((location) => rxjs_1.forkJoin([
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, location.partnerId, true)).pipe(operators_1.tap(inner => log.info(inner)), operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal error', inner)))),
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, location.partnerId, false)).pipe(operators_1.tap(inner => log.info(inner)), operators_1.switchMap((inner) => dynamoDbDriver_1.isNotDynamodbError(inner) ?
            rxjs_1.of(inner) :
            rxjs_1.throwError(RequestError_1.RequestError.create(500, 'internal error', inner)))),
        rxjs_1.of(location)
    ]))).subscribe(([qr1, qr2, location]) => {
        log.info(location);
        log.info(qr2);
        log.info(qr1);
        res.json(location);
    }, error => handleError(res, error));
});
exports.router.post('/', (req, res) => {
    storage.createPartner(partner_1.Partner.fromRequest(req)).subscribe(success => {
        res.json(success);
    });
});
exports.router.put('/', (req, res) => {
    storage.createPartner(partner_1.Partner.fromRequestUpdate(req)).subscribe(success => {
        res.json(success);
    }, error => handleError(res, error));
});
const handleError = (res, error) => {
    log.error(error);
    if (error instanceof RequestError_1.RequestError) {
        res.status(error.status);
        res.json(error);
    }
    else {
        res.status(500);
        res.json(error);
    }
};
