const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {DailyReport} = require('./../domain/DailyReport')
const {pageBuilder} = require('./../domain/page')
const moment = require('moment');


// add dev if local
let tableName = "DailyReport";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}


const partitionKeyName = "locationId";
const sortkeyName = "reportDate";
const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(pageBuilder(data, queryParams))
            }
        })
    })
}

const getReports = (locationId, pageSize, LastEvaluatedKey, date) => {

    `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': locationId,
            ':to': date.clone.endOf('month').toISOString(),
            ':from': date.clone.startOf('month').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
        // ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    }
    return query(queryParams)
}
module.exports = {
    getReports
}
