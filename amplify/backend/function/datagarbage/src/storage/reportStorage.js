const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {DailyReport} = require('./../domain/DailyReport')
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


const putBill = (bill) => {
    return new Promise(((resolve, reject) => {
        dynamodb.put(bill, ((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }))
    }))

}


const createNewReport = (locationId, billdate, distinctTotal, total) => {
    let putItemParams = {
        TableName: tableName,
        Item: new DailyReport(locationId, billdate, distinctTotal, total)
    }
    return putBill(putItemParams)
}


module.exports = {
    createNewReport
}
