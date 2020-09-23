"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportStorage = exports.createNewReport = void 0;
const dynamoDbDriver_1 = require("../../../gastro/src/util/dynamoDbDriver");
const DailyReport_1 = require("../domain/DailyReport");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
// add dev if local
let tableName = 'DailyReport';
if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
}
else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = 'locationId';
const sortkeyName = 'reportDate';
const putBill = (bill) => {
    return new Promise(((resolve, reject) => {
        dynamodb.put(bill, ((err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        }));
    }));
};
exports.createNewReport = (locationId, billdate, distinctTotal, total, pricePerEntry) => {
    let putItemParams = {
        TableName: tableName,
        Item: new DailyReport_1.DailyReport(locationId, billdate, distinctTotal, total, pricePerEntry)
    };
    return putBill(putItemParams);
};
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
            KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
    createReport(locationId, billdate, distinctTotal, total, pricePerEntry) {
        let item = new DailyReport_1.DailyReport(locationId, billdate, distinctTotal, total, pricePerEntry);
        this.dbConnection.putItem(item);
    }
}
exports.reportStorage = reportStorage;
