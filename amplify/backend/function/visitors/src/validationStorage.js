const AWS = require('aws-sdk')
const jwtUtil = require('./jwtUtil')

AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' })
const dynamodb = new AWS.DynamoDB.DocumentClient();
var moment = require('moment');
const crypto = require('crypto');
// add dev if local
let tableName = "validation";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "phonenumberhash";


const insertValidationData = (item) => {
    let putItemParams = {
        TableName: tableName,
        Item: item
    }
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


module.exports.createValidation = (phoneNumber) => {
    const item = {
        phonenumberhash: crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'),
        code: Math.floor(Math.random() * 10000 + 1000),
        validation_requested: moment.utc().unix(),
        validation_success: 0
    }
    return insertValidationData(item)
}


module.exports.validateValidationRequest = (phoneNumber) => {
    const now = moment.utc().unix()
    var params = {};
    params[partitionKeyName] = crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex');
    let getItemParams = {
        TableName: tableName,
        Key: params
    }
    return new Promise((resolve, reject) => {
        dynamodb.get(getItemParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                resolve(true)
            } else {
                let w = data.Item ? data.Item : data
                let coolDown = (1 * 60 * 1000)
                let registeredCoolDown = (24 * 60 * 60 * 1000)
                if (w.validation_success === 0 && now - w.validation_requested > coolDown) {
                    resolve(true)
                } else {
                    reject({interval: (coolDown - (now - w.validation_requested)), status: "cool down"})
                }
                if (now - w.validation_success > registeredCoolDown) {
                    resolve(true)
                } else {
                    reject({
                        interval: (registeredCoolDown - (now - w.validation_requested)),
                        status: "phone number registered"
                    })
                }
            }
        })
    })
}

module.exports.validateNumber = (phoneNumber, code) => {
    var params = {};
    params[partitionKeyName] = crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex');
    let getItemParams = {
        TableName: tableName,
        Key: params
    }
    return new Promise((resolve, reject) => {
        dynamodb.get(getItemParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                reject({error: "validaiton request does not exist"})
            } else {
                let w = data.Item ? data.Item : data
                if (w.code === code && w.validation_success === 0) {
                    w.validation_success = moment.utc().unix()
                    insertValidationData(w).then(elem => jwtUtil.generateJWT(phoneNumber)).catch(err => reject(err))
                } else {
                    reject("invalid")
                }
            }
        })
    })
}

