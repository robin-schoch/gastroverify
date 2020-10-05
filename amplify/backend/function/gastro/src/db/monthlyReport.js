"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthlyReport = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const moment = require("moment");
const bunyan_1 = require("bunyan");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { DailyReport } = require('../domain/DailyReport');
const log = bunyan_1.createLogger({ name: 'monthlyStorage', src: true });
class monthlyReport {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('MonthlyReport', 'partnerId', 'billingDate');
    }
    findPaged(partnerId) {
        const queryParams = {
            ExpressionAttributeValues: {
                ':partner': partnerId,
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :partner `,
            Limit: 122,
            ScanIndexForward: false,
        };
        return this.dbConnection.queryItems(queryParams);
    }
    completeReport(partnerId, billingDate, complete = true) {
        const updateParams = {
            Key: {
                [this.dbConnection.partitionKey]: partnerId,
                [this.dbConnection.sortKey]: billingDate
            },
            UpdateExpression: 'set complete = :complete, paidAt=:paidAt',
            ExpressionAttributeValues: {
                ':complete': complete,
                ':paidAt': complete ? moment().toISOString() : '',
            },
            ReturnValues: 'UPDATED_NEW'
        };
        log.info(updateParams);
        return this.dbConnection.updateItem(updateParams);
    }
}
exports.monthlyReport = monthlyReport;
