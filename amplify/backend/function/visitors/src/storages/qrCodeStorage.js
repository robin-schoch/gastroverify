const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();


const moment = require('moment');


// add dev if local
let tableName = "qrStorage";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "uuid";
const sortKeyName = "ownerId";

const get = (getParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.get(getParams, (err, data) => {
            if (err || Object.keys(data).length < 1) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const getQrCode = (qrCode) => {

    let getItemParams = {
        TableName: tableName,
        Key: qrCode
    }
    return get(getItemParams)
}


module.exports = {
    getQrCode
}
