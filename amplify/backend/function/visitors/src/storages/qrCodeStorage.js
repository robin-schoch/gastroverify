"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrCodeStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'qrCodeStorage', src: true });
class qrCodeStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('QRMapping', 'qrId');
    }
    findMapping(qrId) {
        return this.dbConnection.findById(qrId);
    }
}
exports.qrCodeStorage = qrCodeStorage;
