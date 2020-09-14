const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {Page} = require('../domain/page')

import * as moment from 'moment';

import {createLogger} from 'bunyan';
const log = createLogger({name: "entryStorage", src: true});

// add dev if local
let tableName = "Entrance";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "locationId";
const sortkeyName = "entryTime";

const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(new Page(data.Items, queryParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey))
            }
        })
    })
}

const getEntries = (id, pageSize, LastEvaluatedKey) => {
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': id,
            ':entry': moment().subtract(14, 'days').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
        ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    };
    return query(queryParams)
}


module.exports = {
    getEntries
}
