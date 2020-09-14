import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Page} from '../domain/page';


import {createLogger} from 'bunyan';
import {DailyReport} from '../domain/DailyReport';
import {Observable} from 'rxjs';
import {MonthlyReport} from '../domain/monthlyReport';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const log = createLogger({name: 'reportStorage', src: true});

// add dev if local
let tableName = 'DailyReport';

if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}


const partitionKeyName = 'locationId';
const sortkeyName = 'reportDate';
const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(
            queryParams,
            (err, data) => {
                if (err) {
                    log.error(err);
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

export const getReports = (locationId, pageSize, LastEvaluatedKey, date) => {

    `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`;
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': locationId,
            ':to': date.clone().endOf('month').toISOString(),
            ':from': date.clone().startOf('month').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
        // ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn,
        // birthdate, tableNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    };
    return query(queryParams);
};

export class reportStorage {
    private readonly dbConnection: DbConnection<DailyReport>;

    constructor() {

        this.dbConnection = new DbConnection<DailyReport>(
            'DailyReport',
            'locationId',
            'reportDate'
        );
    }

    public findPaged(
        locationId,
        pageSize,
        LastKey,
        date
    ): Observable<Page<DailyReport> | DynamodbError<MonthlyReport>> {
        const queryParams = {
            ExpressionAttributeValues: {
                ':location': locationId,
                ':to': date.clone().endOf('month').toISOString(),
                ':from': date.clone().startOf('month').toISOString(),
            },
            KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
}
