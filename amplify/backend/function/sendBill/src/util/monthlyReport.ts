import {DbConnection, DynamodbError, Page} from './dynamoDbDriver';

import {createLogger} from 'bunyan';
import {Observable, of, throwError} from 'rxjs';
import {MonthlyReport} from '../domain/monthlyReport';
import {switchMap} from 'rxjs/operators';
import {isNotDynamodbError} from '../../../gastro/src/util/dynamoDbDriver';
import * as moment from 'moment';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();


const log = createLogger({name: 'monthlyStorage', src: true});

export class monthlyReport {

  private readonly dbConnection: DbConnection<MonthlyReport>;

  constructor() {

    this.dbConnection = new DbConnection<MonthlyReport>(
        'MonthlyReport',
        'partnerId',
        'billingDate',
        'prod'
    );
  }

  public findNewReports(): Observable<Page<MonthlyReport>> {
    const params = {
      ExpressionAttributeValues: {
        ':creationDate': moment().subtract(14, 'days').toISOString(),
      },
      FilterExpression: 'billingDate >= :creationDate',
    };
    return this.dbConnection.scanItems(params).pipe(switchMap(a => isNotDynamodbError<Page<MonthlyReport>>(a) ?
                                                                   of(a) :
                                                                   throwError(a)));
  }

  public findByMonthAndYear(year: number, month: number): Observable<Page<MonthlyReport>> {
    var newDate = moment.utc();
    newDate.set('year', 2017);
    newDate.set('month', 7);
    newDate.set('date', 15);
    newDate.startOf('day');
    const date = moment().set('year', year).set('month', month).startOf('month');
    const params = {
      ExpressionAttributeValues: {
        ':startDate': date.subtract(14, 'days').toISOString(),
        ':endDate': date.add(14, 'days').toISOString(),
      },
      FilterExpression: 'billingDate >= :creationDate',
    };
    return this.dbConnection.scanItems(params).pipe(switchMap(a => isNotDynamodbError<Page<MonthlyReport>>(a) ?
                                                                   of(a) :
                                                                   throwError(a)));
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

}

