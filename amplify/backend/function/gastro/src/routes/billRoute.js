"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const monthlyReport_1 = require("../db/monthlyReport");
const bunyan_1 = require("bunyan");
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const monthlyStorage = new monthlyReport_1.monthlyReport();
const log = bunyan_1.createLogger({ name: 'billRoute', src: true });
exports.router = express_1.Router();
exports.router.get('/:partnerId', ((req, res) => {
    // @ts-ignore
    monthlyStorage.findPaged(req.xUser.email).subscribe(elem => {
        if (dynamoDbDriver_1.isNotDynamodbError(elem)) {
            res.status(500);
            log.error(elem);
        }
        res.json(elem);
    });
}));
