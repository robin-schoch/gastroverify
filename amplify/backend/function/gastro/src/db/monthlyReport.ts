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
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :partner `,
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
                [this.dbConnection.partitionKey]: partnerId,
                [this.dbConnection.sortKey]: billingDate
            },
            UpdateExpression: 'set complete = :complete, paidAt=:paidAt',
            ExpressionAttributeValues: {
                ':complete': complete,
                ':paidAt': complete ? moment().toISOString() : '',
            },
            ReturnValues: 'UPDATED_NEW'
        };
        log.info(updateParams);
        return this.dbConnection.updateItem(updateParams);
    }

}

