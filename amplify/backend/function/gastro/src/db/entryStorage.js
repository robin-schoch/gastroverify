"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryStorage = exports.getEntries = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const moment = require("moment");
const bunyan_1 = require("bunyan");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const log = bunyan_1.createLogger({ name: 'entryStorage', src: true });
// add dev if local
let tableName = 'Entrance';
if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
}
else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = 'locationId';
const sortkeyName = 'entryTime';
const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(new dynamoDbDriver_1.Page(data.Items, queryParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey));
            }
        });
    });
};
exports.getEntries = (id, pageSize, LastEvaluatedKey) => {
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': id,
            ':entry': moment().subtract(14, 'days').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
        //ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn,
        // birthdate, tableNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    };
    return query(queryParams);
};
class entryStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Entrance', 'locationId', 'entryTime');
    }
    findPaged(id, pageSize, LastEvaluatedKey) {
        const queryParams = {
            ExpressionAttributeValues: {
                ':location': id,
                ':entry': moment().subtract(14, 'days').toISOString(),
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} >= :entry`,
            ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastEvaluatedKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
}
exports.entryStorage = entryStorage;
