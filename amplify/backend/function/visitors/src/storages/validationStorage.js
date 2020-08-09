const AWS = require('aws-sdk')
const jwtUtil = require('../util/jwtUtil')
const smsUtil = require('../util/smsUtil')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
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
        code: Math.floor(10000 + Math.random() * 90000),
        validation_requested: moment().toISOString(),
        validation_success: "",
        try: 5,
        strikes: 0,
    }

    return Promise.all([
        insertValidationData(item),
        smsUtil.sendVerifactionSMS(phoneNumber, item.code)
    ])

}


module.exports.validationSuccess = (phonNumber, momentum) => {
    var params = {};
    params[partitionKeyName] = crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex');
    let getItemParams = {
        TableName: tableName,
        Key: params
    }
    return new Promise((resolve, reject) => {
        dynamodb.get(getItemParams, (err, data) => {
            if (err || Object.keys(data).length === 0) {
                resolve(false)
            } else {
                let w = data.Item ? data.Item : data
                if (moment(w.validation_success).diff(momentum) === 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}


module.exports.validateValidationRequest = (phoneNumber) => {
    const now = moment()
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
                let coolDown = 5 // min
                let registeredCoolDown = 3 // days
                let duration = moment.duration(now.diff(moment(w.validation_requested))).asMinutes()
                let duration2 = moment.duration(now.diff(moment(w.validation_success))).asDays()
                if (w.validation_success === "" && duration > coolDown) {
                    resolve(true)
                } else if (duration2 > registeredCoolDown) {
                    resolve(true)
                } else {
                    if (w.validation_requested === "") {
                        reject({interval: coolDown - duration, status: "cool down"})
                    } else {
                        reject({interval: registeredCoolDown - duration2, status: "already registered"})
                    }
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
                if (w.code === code && w.validation_success === "" && w.try > 0) {
                    w.validation_success = moment().toISOString()
                    insertValidationData(w).then(elem => resolve(jwtUtil.generateJWT(phoneNumber, w.validation_success))).catch(err => reject(err))
                } else {
                    if (w.try > 0) {
                        w.try = w.try - 1
                        insertValidationData(w).then(elem => {
                            reject("invalid " + w.try + " remaining")
                        })
                    } else {
                        reject("validation blocked")
                    }

                }
            }
        })
    })
}

