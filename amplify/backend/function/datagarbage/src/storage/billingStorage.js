const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


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
        dynamodb.get(getItemParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                reject(data)
            } else {
                let w = data.Item ? data.Item : data
                resolve(Object.assign(new Bill(), w))
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

const finalizeBill = (bill) => {
    let putItemParams = {
        TableName: tableName,
        Item: bill
    }
    return putBill(putItemParams)
}

const createNewBill = (locationId, date) => {

    let putItemParams = {
        TableName: tableName,
        Item: new Bill(locationId, date, false, "", -1, [])
    }
    return putBill(putItemParams)
}

const finishBill = async (locationId, billDate) => {
    var params = {
        TableName: tableName,
        Key: {
            "locationId": locationId,
            "billingDate": billDate // --> watch out this is wrong
        }
    }

    let bill = await getBilling(params)
    bill.complete = true
    bill.total = bill.entriesPerDay.map(e => e.entries).reduce((n, acc) => n + acc) * 0.15
    return putBill(bill)
}


const updateBill = (locationId, billDate, date, total) => {
    var params = {
        TableName: tableName,
        Key: {
            "locationId": locationId,
            "billingDate": billDate // --> watch out this is wrong
        },
        UpdateExpression: "SET #e = list_append(#e, :vals)",
        ExpressionAttributeNames: {
            "#e": "entriesPerDay"
        },
        ExpressionAttributeValues: {
            ":vals": [{date: date, entries: total}]
        },
        ReturnValues: "UPDATED_NEW"
    }
    return new Promise((resolve, reject) => {
        dynamodb.update(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const createBill = (bill) => {
    let putItemParams = {
        TableName: tableName,
        Item: bill
    }
    return putBill(putItemParams)
}


module.exports = {
    updateBill,
    createBill
}
