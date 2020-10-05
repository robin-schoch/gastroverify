"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeMappingStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const bunyan_1 = require("bunyan");
const util = require('util');
const log = bunyan_1.createLogger({ name: 'qrCodeMappingStorage', src: true });
class QrCodeMappingStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('QRMapping', 'qrId');
    }
    findMapping(qrId) {
        return this.dbConnection.findById(qrId).pipe();
    }
    deleteMapping(qrId) {
        return this.dbConnection.deleteItem(qrId);
    }
    createMapping(qrCodeMapping) {
        return this.dbConnection.putItem(qrCodeMapping);
    }
}
exports.QrCodeMappingStorage = QrCodeMappingStorage;
