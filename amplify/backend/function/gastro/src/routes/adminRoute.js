"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const moment = require("moment");
const express_1 = require("express");
const bunyan_1 = require("bunyan");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const entryStorage_1 = require("../db/entryStorage");
const reportStorage_1 = require("../db/reportStorage");
const locationStorage_1 = require("../db/locationStorage");
const { monthlyReport } = require('../db/monthlyReport');
const { partnerStorage } = require('../db/partnerStorage');
const monthlyReportStorage = new monthlyReport();
const locationstorage = new locationStorage_1.locationStorage();
const log = bunyan_1.createLogger({ name: 'adminRoute', src: true });
exports.router = express_1.Router();
const reportstorage = new reportStorage_1.reportStorage();
const storage = new partnerStorage();
const entrystorage = new entryStorage_1.entryStorage();
/***************************************************************************
 *                                                                         *
 * partner                                                                 *
 *                                                                         *
 **************************************************************************/
exports.router.get('/partner', (req, res) => {
    storage.findPartnerPaged(100, req.query.LastEvaluatedKey).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe((pagePartner) => res.json(pagePartner), error => {
        res.status(500);
        res.json(error);
    });
});
exports.router.get('/partner/:id', (req, res) => {
    storage.findPartner(req.params.id).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe((partner) => {
        res.json(partner);
    }, error => {
        res.status(500);
        res.json(error);
    });
});
exports.router.get('/partner/:id/location', ((req, res) => {
    locationstorage.findLocations(req.params.id, 100, null).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe(locations => {
        res.json(locations);
    }, error => {
        res.status(500);
        res.json(error);
    });
}));
exports.router.put('/partner/:id/hide', (req, res) => {
    console.log(req.query.hide);
    console.log(req.query.hide === 'true');
    storage.hidePartner(req.params.id, req.query.hide === 'true').pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe(elem => {
        res.json(Object.assign({}, { email: req.params.id }, elem));
    }, error => {
        res.status(500);
        res.json(error);
    });
});
exports.router.get('/partner/:id/entries/:locationId', (req, res) => {
    // @ts-ignore
    /*
     getEntries(
     req.params.locationId,
     req.query.Limit ? req.query.Limit : 100,
     // @ts-ignore
     req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
     )
     .then(elems => {
     res.json(elems);
     }).catch(error => {
     log.error(error);
     res.status(503);
     res.json({error: 'oh boy'});
     });
     */
});
exports.router.get('/partner/:id/report/:locationId', (req, res) => {
    reportstorage.findPaged(req.params.locationId, req.query.Limit ? req.query.Limit : 31, 
    // @ts-ignore
    req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null, 
    // @ts-ignore
    moment(req.query.date)).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe(reports => {
        res.json(reports);
    }, error => {
        res.status(500);
        res.json(error);
    });
});
exports.router.get('/partner/:partnerId/bill', (req, res) => {
    monthlyReportStorage.findPaged(req.params.partnerId).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe(elem => {
        res.json(elem);
    }, error => {
        res.status(500);
        res.json(error);
    });
});
exports.router.put('/partner/:partnerId/bill/:billingDate', (req, res) => {
    log.info(req);
    monthlyReportStorage.completeReport(req.params.partnerId, req.params.billingDate, req.body.complete).subscribe(elem => {
        if (!dynamoDbDriver_1.isNotDynamodbError(elem)) {
            res.status(500);
            log.error(elem);
        }
        res.json(elem);
    });
});
/***************************************************************************
 *                                                                         *
 * bills                                                                   *
 *                                                                         *
 **************************************************************************/
