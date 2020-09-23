import {DbConnection} from '../../../gastro/src/util/dynamoDbDriver';
import {DailyReport} from '../domain/DailyReport';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


// add dev if local
let tableName = 'DailyReport';

if (process.env.ENV && process.env.ENV !== 'NONE') {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev';
}
const partitionKeyName = 'locationId';
const sortkeyName = 'reportDate';


const putBill = (bill) => {
    return new Promise(((resolve, reject) => {
        dynamodb.put(
            bill,
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


export const createNewReport = (locationId, billdate, distinctTotal, total, pricePerEntry) => {
    let putItemParams = {
        TableName: tableName,
        Item: new DailyReport(
            locationId,
            billdate,
            distinctTotal,
            total,
            pricePerEntry
        )
    };

    return putBill(putItemParams);
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
    ) {
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

    public createReport(
        locationId, billdate, distinctTotal, total, pricePerEntry
    ) {
        let item = new DailyReport(
            locationId,
            billdate,
            distinctTotal,
            total,
            pricePerEntry
        );

        this.dbConnection.putItem(item);

    }
}
