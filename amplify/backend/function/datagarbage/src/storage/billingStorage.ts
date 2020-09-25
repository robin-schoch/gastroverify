import {Bill} from '../domain/bill';

const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();



// add dev if local
let tableName = "Billing";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "locationId";
const sortkeyName = "billingDate";

const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const getBilling = (getParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.get(getParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                reject(data)
            } else {
                let w = data.Item ? data.Item : data
                resolve(Object.assign(<Bill>{}, w))
            }
        })
    })
}

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






export const createBill = (bill) => {
    let putItemParams = {
        TableName: tableName,
        Item: bill
    }
    return putBill(putItemParams)
}


