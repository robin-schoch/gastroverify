const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


// add dev if local
let tableName = "qrCodeMapping";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "qrCodeId";
const sortKeyName = "ownerId";

const get = (getParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(getParams, (err, data) => {
            console.log(data)
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
        ProjectionExpression: 'checkIn, barName',
        Limit: 1,
    }
    return get(getItemParams)
}


module.exports = {
    getQrCode
}
