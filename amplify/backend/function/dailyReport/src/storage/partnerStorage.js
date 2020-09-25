"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerStorage = exports.scanPartner = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
//const moment = require('moment');
let tableName = 'Partner';
if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
}
else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = 'email';
exports.scanPartner = (lastEvaluatedKey) => {
    let scanItem = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 1000000
    };
    return new Promise(((resolve, reject) => {
        dynamodb.scan(scanItem, ((err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        }));
    }));
};
class partnerStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Partner', 'email');
    }
    findPartnerPaged(lastKey = null) {
        return this.dbConnection.scanItems({ Limit: 10000, ExclusiveStartKey: lastKey });
    }
}
exports.partnerStorage = partnerStorage;
