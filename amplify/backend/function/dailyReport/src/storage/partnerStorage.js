const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
//const moment = require('moment');


let tableName = "Partner";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}

const partitionKeyName = "email";

const scanPartner = (lastEvaluatedKey) => {

    let scanItem = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 1000000
    }

    return new Promise(((resolve, reject) => {
        dynamodb.scan(scanItem, ((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }))
    }))
}


module.exports = {
    scanPartner
}
