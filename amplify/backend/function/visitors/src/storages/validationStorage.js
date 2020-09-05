const AWS = require('aws-sdk')
const jwtUtil = require('../util/jwtUtil')
const smsUtil = require('../util/smsUtil')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "validationStorage", src: true});


const crypto = require('crypto');
// add dev if local
let tableName = "Validation";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "phoneNumberHash";




const insertValidationData = (item) => {
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


module.exports.createValidation = (phoneNumber, senderID, text = 'Dein Verifikationcode ist:') => {
    const item = {
        phoneNumberHash: crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'),
        code: Math.floor(10000 + Math.random() * 90000),
        validation_requested: moment().toISOString(),
        validation_success: "",
        try: 5,
        strikes: 0,
    }

    return Promise.all([
        insertValidationData(item),
        smsUtil.sendVerifactionSMS(phoneNumber, item.code, senderID, text)
    ])

}


module.exports.validationSuccess = (phoneNumber, momentum) => {
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
                resolve({})
            } else {
                let w = data.Item ? data.Item : data
                let coolDown = 1 // min
                let registeredCoolDown = 10 // min
                let duration = moment.duration(now.diff(moment(w.validation_requested)))
                let duration2 = moment.duration(now.diff(moment(w.validation_success)))
                if (w.validation_success === "" && duration.asMinutes() > coolDown) {

                    resolve(w)
                } else if (duration2.asMinutes() > registeredCoolDown) {

                    resolve(w)
                } else {
                    if (w.validation_success === "") {
                        reject({
                            interval: moment.duration(coolDown, 'minutes').subtract(duration).format("hh:mm:ss"),
                            status: "cool down"
                        })
                    } else {
                        reject({
                            interval: moment.duration(registeredCoolDown, 'minutes').subtract(duration2).format("hh:mm:ss"),
                            status: "already registered"
                        })
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
                reject({error: "no validation request"})
            } else {
                let w = data.Item ? data.Item : data
                if (w.code === Number(code) && w.validation_success === "" && w.try > 0) {
                    w.validation_success = moment().toISOString()
                    insertValidationData(w).then(elem => resolve(jwtUtil.generateJWT(phoneNumber, w.validation_success))).catch(err => reject(err))
                } else {
                    if (w.try > 0) {
                        w.try = w.try - 1
                        insertValidationData(w).then(elem => {
                            reject({error: "invalid code", remaining: w.try})
                        })
                    } else {
                        reject({error: "validation blocked"})
                    }

                }
            }
        })
    })
}

