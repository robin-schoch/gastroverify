"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const partnerStorage_1 = require("../db/partnerStorage");
const reportStorage_1 = require("../db/reportStorage");
const moment = require("moment");
const bunyan_1 = require("bunyan");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const operators_1 = require("rxjs/operators");
const locationStorage_1 = require("../db/locationStorage");
const rxjs_1 = require("rxjs");
const log = bunyan_1.createLogger({ name: 'reportRoute', src: true });
exports.router = express_1.Router();
const storage = new reportStorage_1.reportStorage();
const partStorage = new partnerStorage_1.partnerStorage();
const locationstorage = new locationStorage_1.locationStorage();
exports.router.get('/daily/:locationId', ((req, res) => {
    log.info({ query: req.query }, 'request daily report');
    locationstorage.findLocation(req.xUser.email, req.params.locationId).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a)), operators_1.mergeMap((location) => storage.findPaged(location.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null, req.query.date ? moment(req.query.date) : moment())), operators_1.switchMap((a) => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))).subscribe((values) => {
        res.json(values);
    }, (error) => {
        res.status(500);
        res.json(error);
    });
}));
