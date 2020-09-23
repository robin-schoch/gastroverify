import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Page} from '../domain/page';


import {createLogger} from 'bunyan';
import {DailyReport} from '../domain/DailyReport';
import {Observable} from 'rxjs';


const log = createLogger({name: 'reportStorage', src: true});


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
    ): Observable<Page<DailyReport> | DynamodbError<DailyReport>> {
        const queryParams = {
            ExpressionAttributeValues: {
                ':location': locationId,
                ':to': date.clone().endOf('month').toISOString(),
                ':from': date.clone().startOf('month').toISOString(),
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} BETWEEN :from and :to`,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: LastKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
}
