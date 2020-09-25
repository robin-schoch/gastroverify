"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'checkInStorage', src: true });
class checkInStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Entrance', 'locationId', 'entryTime');
    }
    findEntry(locationId, entryTime) {
        return this.dbConnection.findById(locationId, entryTime);
    }
    createEntry(checkin) {
        return this.dbConnection.putItem(checkin);
    }
}
exports.checkInStorage = checkInStorage;
