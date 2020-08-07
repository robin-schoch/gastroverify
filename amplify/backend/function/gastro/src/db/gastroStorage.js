const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');
const Gastro = require('./../domain/gastro')
let tableName = "gastro";
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


const updateGastro = (gastro, create = false) => {
    let putItemParams = {
        TableName: tableName,
        Item: gastro
    }
    if (create) putItemParams['ConditionExpression'] = 'attribute_not_exists(email)'
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


const createGastro = (email, firstName, lastName, address, city, zipcode) => {
    const g = new Gastro(email, firstName, lastName, city, zipcode)
    return updateGastro(g, true)
}



module.exports = {
    createGastro,
    updateGastro,
    getGastro
}