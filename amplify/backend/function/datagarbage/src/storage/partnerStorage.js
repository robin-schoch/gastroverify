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

const getGastro = (email) => {
    var params = {};
    params[partitionKeyName] = email;
    let getItemParams = {
        TableName: tableName,
        Key: params
    }
    return new Promise((resolve, reject) => {
        dynamodb.get(getItemParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                reject(data)
            } else {
                let w = data.Item ? data.Item : data
                resolve(w)
            }
        })
    })
}

const scanPartner = (lastEvaluatedKey) => {
    var params = {};
    params[partitionKeyName] = email;
    let scanItem = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 10
    }

    return new Promise(((resolve, reject) => {
        dynamodb.scan(params, ((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }))
    }))
}


module.exports = {
    getGastro,
    scanPartner
}
