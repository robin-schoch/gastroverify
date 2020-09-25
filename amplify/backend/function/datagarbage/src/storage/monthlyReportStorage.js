"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBill = void 0;
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
// add dev if local
let tableName = "MonthlyReport";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
}
else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = "partnerId";
const sortkeyName = "billingDate";
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
exports.createBill = (bill) => {
    let putItemParams = {
        TableName: tableName,
        Item: bill
    };
    return putBill(putItemParams);
};
