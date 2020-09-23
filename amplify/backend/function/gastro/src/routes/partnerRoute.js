"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const partner_1 = require("../domain/partner");
const bunyan_1 = require("bunyan");
const qrCodeMappingStorage_1 = require("../db/qrCodeMappingStorage");
const partnerStorage_1 = require("../db/partnerStorage");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const qrCodeMapping_1 = require("../domain/qrCodeMapping");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const log = bunyan_1.createLogger({ name: 'partnerRoute', src: true });
const storage = new partnerStorage_1.partnerStorage();
const mappingStorage = new qrCodeMappingStorage_1.QrCodeMappingStorage();
exports.router = express_1.Router();
exports.router.get('/', (req, res) => {
    // @ts-ignore
    storage.findPartner(req.xUser.email).subscribe(parter => {
        if (!dynamoDbDriver_1.isNotDynamodbError(parter)) {
            res.status(500);
            log.error(parter);
        }
        res.json(parter);
    });
});
exports.router.get('/:id', (req, res) => {
    // @ts-ignore
    storage.findPartner(req.xUser.email).subscribe(partner => {
        if (!dynamoDbDriver_1.isNotDynamodbError(partner)) {
            res.status(500);
            log.error(partner);
        }
        res.json(partner);
    });
});
exports.router.post('/:id/bar', (req, res) => {
    const location = partner_1.Location.fromRequest(req);
    log.info(location);
    if (!location.locationId) {
        res.status(409);
        res.json(location);
    }
    // @ts-ignore
    storage.findPartner(req.xUser.email).pipe(operators_1.filter(dynamoDbDriver_1.isNotDynamodbError), operators_1.map(partner => {
        partner.locations.push(location);
        return partner;
    }), operators_1.switchMap(partner => rxjs_1.forkJoin([
        storage.createPartner(partner),
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, partner.email, true)),
        mappingStorage.createMapping(qrCodeMapping_1.QrCodeMapping.fromLocation(location, partner.email, false))
    ]))).subscribe(([partner, qr1, qr2]) => {
        log.info(partner);
        log.info(qr1);
        log.info(qr2);
        if (!(dynamoDbDriver_1.isNotDynamodbError(qr1) && dynamoDbDriver_1.isNotDynamodbError(qr2) && dynamoDbDriver_1.isNotDynamodbError(partner))) {
            res.status(500);
            res.json({ partner, qr1, qr2 });
        }
        else {
            res.json(partner);
        }
    });
});
exports.router.delete('/:id/bar/:barId', (req, res) => {
    // @ts-ignore
    storage.findPartner(req.xUser.email).pipe(operators_1.filter(dynamoDbDriver_1.isNotDynamodbError), operators_1.map(partner => {
        let location = partner.locations.filter(l => l.locationId === req.params.barId)[0];
        location = Object.assign(location, { active: false });
        partner.locations = [
            ...partner.locations.filter(l => l.locationId !== req.params.barId),
            location
        ];
        return { partner: partner, checkIn: location.checkInCode, checkOut: location.checkOutCode };
    }), operators_1.switchMap(({ partner, checkIn, checkOut }) => rxjs_1.forkJoin([
        mappingStorage.deleteMapping(checkIn),
        mappingStorage.deleteMapping(checkOut),
        storage.createPartner(partner)
    ]))).subscribe(([qr1, qr2, partner]) => {
        if (!(dynamoDbDriver_1.isNotDynamodbError(qr1) && dynamoDbDriver_1.isNotDynamodbError(qr2) && dynamoDbDriver_1.isNotDynamodbError(partner))) {
            res.status(500);
            log.error({
                partner, qr1, qr2
            });
            res.json({ partner, qr1, qr2 });
        }
        else {
            res.json(partner);
        }
    });
});
exports.router.post('/', (req, res) => {
    storage.createPartner(partner_1.Partner.fromRequest(req)).subscribe(success => {
        res.json(success);
    });
});
