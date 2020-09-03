const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {DailyReport} = require('./../domain/DailyReport')
const {pageBuilder} = require('./../domain/page')
const moment = require('moment');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "monthlyStorage", src: true});


// add dev if local
let tableName = "MonthlyReport";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}


const partitionKeyName = "partnerId";
const sortkeyName = "billingDate";
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

const getBills = (partnerId) => {

    const queryParams = {
        ExpressionAttributeValues: {
            ':partner': partnerId,
        },
        KeyConditionExpression: `${partitionKeyName} = :partner `,
        // ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
        Limit: 122,
        ScanIndexForward: false,
        TableName: tableName
    }
    return query(queryParams)
}
module.exports = {
    getBills
}
