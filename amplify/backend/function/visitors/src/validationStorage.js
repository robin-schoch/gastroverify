
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient();
var moment = require('moment');
const crypto = require('crypto');
// add dev if local
let tableName = "checkIn";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "id";
const sortKeyName = "barid";
const secondaryKeyName = "barid";


module.exports.createValidation = (phoneNumber) => {

    const item = {
        phonenumberhash: crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'),
        code: Math.floor(Math.random() * 10000 + 1000),
        validation_requested: moment.utc().unix(),
        validation_success: 0
    }
    let putItemParams = {
        TableName: tableName,
        Item: item
    }
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

