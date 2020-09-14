import {DbConnection, DynamodbError, Page} from '../util/dynamoDbDriver';
import * as moment from 'moment';

import {createLogger} from 'bunyan';
import {Observable} from 'rxjs';
import {MonthlyReport} from '../domain/monthlyReport';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {DailyReport} = require('../domain/DailyReport');

const log = createLogger({name: 'monthlyStorage', src: true});


// add dev if local
let tableName = 'MonthlyReport';

if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}


const partitionKeyName = 'partnerId';
const sortkeyName = 'billingDate';


const query = (queryParams) => {
    return new Promise((resolve, reject) => {

        dynamodb.query(
            queryParams,
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Page.pageBuilder(
                        data,
                        queryParams
                    ));
                }
            }
        );
    });
};

const update = (updateParams) => {
    return new Promise(((resolve, reject) => {
        dynamodb.update(
            updateParams,
            ((err, data) => {
                if (err) {

                    reject(err);
                } else {
                    resolve(data);
                }
            })
        );
    }));
};

export const getBills = (partnerId) => {

    const queryParams = {
        ExpressionAttributeValues: {
            ':partner': partnerId,
        },
        KeyConditionExpression: `${partitionKeyName} = :partner `,
        // ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn,
        // birthdate, tableNumber',
        Limit: 122,
        ScanIndexForward: false,
        TableName: tableName
    };
    return query(queryParams);
};

export const completeBill = (partnerId, billingDate) => {
    const updateParams = {
        TableName: tableName,
        Key: {
            partnerId: partnerId,
            billingDate: billingDate
        },
        UpdateExpression: 'set complete = :complete, paidAt=:paidAt',
        ExpressionAttributeValues: {
            ':complete': true,
            ':paidAt': moment().toISOString(),
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return update(updateParams);
};

export const incompleteBill = (partnerId, billingDate) => {
    const updateParams = {
        TableName: tableName,
        Key: {
            partnerId: partnerId,
            billingDate: billingDate
        },
        UpdateExpression: 'set complete = :complete, paidAt=:paidAt',
        ExpressionAttributeValues: {
            ':complete': false,
            ':paidAt': '',
        },
        ReturnValues: 'UPDATED_NEW'
    };
    log.info(updateParams);


    return update(updateParams);
};


export class monthlyReport {

    private readonly dbConnection: DbConnection<MonthlyReport>;

    constructor() {

        this.dbConnection = new DbConnection<MonthlyReport>(
            'MonthlyReport',
            'partnerId',
            'billingDate'
        );
    }

    public findPaged(partnerId: string): Observable<Page<MonthlyReport> | DynamodbError<MonthlyReport>> {
        const queryParams = {
            ExpressionAttributeValues: {
                ':partner': partnerId,
            },
            KeyConditionExpression: `${partitionKeyName} = :partner `,
            Limit: 122,
            ScanIndexForward: false,
        };
        return this.dbConnection.queryItems(queryParams);
    }

    public completeReport(
        partnerId: string,
        billingDate: string,
        complete = true
    ): Observable<Partial<MonthlyReport> | DynamodbError<MonthlyReport>> {
        const updateParams = {
            Key: {
                partnerId: partnerId,
                billingDate: billingDate
            },
            UpdateExpression: 'set complete = :complete, paidAt=:paidAt',
            ExpressionAttributeValues: {
                ':complete': complete,
                ':paidAt': '',
            },
            ReturnValues: 'UPDATED_NEW'
        };
        log.info(updateParams);
        return this.dbConnection.updateItem(updateParams);
    }

}

