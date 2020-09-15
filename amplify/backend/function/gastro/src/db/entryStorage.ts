import {DbConnection, DynamodbError, Page} from '../util/dynamoDbDriver';

const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();


import * as moment from 'moment';

import {createLogger} from 'bunyan';
import {MonthlyReport} from '../domain/monthlyReport';
import {Observable} from 'rxjs';
const log = createLogger({name: "entryStorage", src: true});

// add dev if local
let tableName = "Entrance";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "locationId";
const sortkeyName = "entryTime";

const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(new Page(data.Items, queryParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey))
            }
        })
    })
}

export const getEntries = (id, pageSize, LastEvaluatedKey) => {
    const queryParams = {
        ExpressionAttributeValues: {
            ':location': id,
            ':entry': moment().subtract(14, 'days').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
        ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    };
    return query(queryParams)
}


export class entryStorage {

    private readonly dbConnection: DbConnection<MonthlyReport>;

    constructor() {

        this.dbConnection = new DbConnection<MonthlyReport>(
            'Entrance',
            'locationId',
            'entryTime'
        );
    }

    public findPaged(id: string, pageSize: number, LastEvaluatedKey: any): Observable<Page<any> | DynamodbError<any>> {
        const queryParams = {
            ExpressionAttributeValues: {
                ':location': id,
                ':entry': moment().subtract(14, 'days').toISOString(),
            },
            KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
            ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastEvaluatedKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }

}
