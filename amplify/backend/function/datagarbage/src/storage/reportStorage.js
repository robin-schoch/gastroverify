"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewReport = exports.getReports = void 0;
// @ts-ignore
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { DailyReport } = require('./../domain/DailyReport');
// add dev if local
let tableName = "DailyReport";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
}
else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = "locationId";
const sortkeyName = "reportDate";
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
exports.getReports = (id, dateFrom, dateTo) => {
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': id,
            ':from': dateFrom.toISOString(),
            ':to': dateTo.toISOString()
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
        Limit: 31,
        ScanIndexForward: false,
        TableName: tableName
    };
    return queryBill(queryParams);
};
const queryBill = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
};
exports.createNewReport = (locationId, billdate, distinctTotal, total) => {
    let putItemParams = {
        TableName: tableName,
        Item: new DailyReport(locationId, billdate, distinctTotal, total)
    };
    return putBill(putItemParams);
};
