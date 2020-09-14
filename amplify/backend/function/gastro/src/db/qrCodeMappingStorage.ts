const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
import moment from 'moment';
const util = require('util');


import bunyan from 'bunyan';
const log = bunyan.createLogger({name: "qrCodeMappingStorage", src: true});


let tableName = "QRMapping";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "qrId";


export const addQrCodeMapping = (mapping) => {
    let putItemParams = {
        TableName: tableName,
        Item: mapping
    }
    // if (create) putItemParams['ConditionExpression'] = 'attribute_not_exists(email)'

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

export const deleteQrMapping = (mapping, ownerId) => {
    let deleteItem = {
        TableName: tableName,
        Key: {
            qrId: mapping
        },
    }

    return new Promise(((resolve, reject) => {
        dynamodb.delete(deleteItem, (err, data) => {
            if (err) {

                reject(err)
            } else {

                resolve(data)
            }
        })
    }))

  //  return util.promisify(dynamodb.delete)(deleteItem)

}


