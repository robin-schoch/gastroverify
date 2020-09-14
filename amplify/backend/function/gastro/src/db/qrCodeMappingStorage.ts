import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';

const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const util = require('util');


import {createLogger} from 'bunyan';
import {Partner} from '../domain/partner';
import {Observable} from 'rxjs';
import {QrCodeMapping} from '../domain/qrCodeMapping';
const log = createLogger({name: "qrCodeMappingStorage", src: true});


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

export class QrCodeMappingStorage {
    private readonly dbConnection: DbConnection<QrCodeMapping>;

    constructor() {

        this.dbConnection = new DbConnection<QrCodeMapping>(
            'QRMapping',
            'qrId'
        );
    }

    public findMapping(qrId: string): Observable<QrCodeMapping | DynamodbError<QrCodeMapping>> {
        return this.dbConnection.findById(qrId).pipe(
        );
    }

    public deleteMapping(qrId: string): Observable<Partial<QrCodeMapping> | DynamodbError<QrCodeMappingStorage>> {
        return this.dbConnection.deleteItem(qrId)
    }

    public createMapping(qrCodeMapping: QrCodeMapping): Observable<Partial<QrCodeMapping> | DynamodbError<QrCodeMapping>> {
        return this.dbConnection.putItem(qrCodeMapping);
    }
}


