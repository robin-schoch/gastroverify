import bunyan from 'bunyan';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
import {Page} from '../domain/page';

const {Location, Partner} = require('../domain/partner');

const log = bunyan.createLogger({name: 'partnerStorage', src: true});


let tableName = 'Partner';
if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}

const partitionKeyName = 'email';

export const getGastro = (email) => {
    var params = {};
    params[partitionKeyName] = email;
    let getItemParams = {
        TableName: tableName,
        Key: params
    };
    return new Promise((resolve, reject) => {
        dynamodb.get(
            getItemParams,
            (err, data) => {
                if (err || Object.keys(data).length === 0) {
                    reject(data);
                } else {
                    let w = data.Item ? data.Item : data;
                    resolve(w);
                }
            }
        );
    });
};

const scanPartner = (scanItem) => {

    return new Promise(((resolve, reject) => {
        dynamodb.scan(
            scanItem,
            ((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Page.pageBuilder(
                        data,
                        scanItem
                    ));
                }
            })
        );
    }));
};


const updatePartner = (partner, email, body) => {
    let updateItemParams = {
        TableName: tableName,
        Key: {
            'email': email,
        },
        UpdateExpression: 'set address = :address, city=:city, firstName=:first, lastName=:last, zipcode=:zip',
        ExpressionAttributeValues: {
            ':address': body.address,
            ':city': body.city,
            ':first': body.firstname,
            ':last': body.lastname,
            ':zip': body.zipcode
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return new Promise((resolve, reject) => {
        dynamodb.update(
            updateItemParams,
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
};

export const createPartner = (gastro, create = false) => {
    let putItemParams = {
        TableName: tableName,
        Item: gastro
    };
    if (create) putItemParams['ConditionExpression'] = 'attribute_not_exists(email)';

    return new Promise((resolve, reject) => {
        dynamodb.put(
            putItemParams,
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(putItemParams.Item);
                }
            }
        );
    });
};


export const createNewPartner = (email, firstName, lastName, address, city, zipcode) => {
    const g = new Partner(
        email,
        firstName,
        lastName,
        address,
        city,
        zipcode
    );
    return createPartner(
        g,
        true
    );
};

export const getAllPartner = (lastEvaluatedKey) => {
    let scanItem = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: 100
    };
    return scanPartner(scanItem);
};


