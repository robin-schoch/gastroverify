const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "qrCodeStorage", src: true});


// add dev if local
let tableName = "QRMapping";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "qrId";

const get = (getParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(getParams, (err, data) => {
            if (err || !data.Items || data.Items.length < 1) {
                reject(err)
            } else {
                resolve(data.Items[0])
            }
        })
    })
}


const getQrCode = (qrCode) => {

    let getItemParams = {
        TableName: tableName,
        ExpressionAttributeValues: {
            ':qrCode': qrCode,
        },
        KeyConditionExpression: `${partitionKeyName} = :qrCode`,
        Limit: 1,
    }
    return get(getItemParams)
}


module.exports = {
    getQrCode
}
