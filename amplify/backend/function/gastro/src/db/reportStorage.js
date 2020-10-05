"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const bunyan_1 = require("bunyan");
const log = bunyan_1.createLogger({ name: 'reportStorage', src: true });
class reportStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('DailyReport', 'locationId', 'reportDate');
    }
    findPaged(locationId, pageSize, LastKey, date) {
        const queryParams = {
            ExpressionAttributeValues: {
                ':location': locationId,
                ':to': date.clone().endOf('month').toISOString(),
                ':from': date.clone().startOf('month').toISOString(),
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} BETWEEN :from and :to`,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
}
exports.reportStorage = reportStorage;
