const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
const util = require('util');

let tableName = "qrCodeMapping";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "qrCodeId";
const sortKeyName = "ownerId";


const addQrCodeMapping = (mapping) => {
    let putItemParams = {
        TableName: tableName,
        Item: mapping
    }
    // if (create) putItemParams['ConditionExpression'] = 'attribute_not_exists(email)'
    console.log(putItemParams)
    return new Promise((resolve, reject) => {
        dynamodb.put(putItemParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(putItemParams.Item)
            }
        });
    })
}

const deleteQrMapping = (mapping) => {
    let deleteItem = {
        TableName: tableName,
        Key: {
            qrCodeId: mapping,
        },
    }

    return util.promisify(dynamodb.delete)(deleteItem)

}


module.exports = {
    addQrCodeMapping,
    deleteQrMapping
}
