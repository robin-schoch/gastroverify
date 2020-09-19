/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 STORAGE_QRMAPPING_ARN
 STORAGE_QRMAPPING_NAME
 Amplify Params - DO NOT EDIT */

import {calc} from './domain/heavyShit';

import {DbConnection} from './domain/dynamoDbDriver';
import {forkJoin} from 'rxjs';


export const handler = async (event, context) => {
    const dbConnection = new DbConnection(
        'QRMapping',
        'qrId'
    );

    console.log(calc().shit);
    const partnerTable = new DbConnection(
        'Partner',
        'email'
    );



    const res = await forkJoin(
        {
            partner: partnerTable.findById('andreas.umbricht@gmail.com'),
            qrCode: dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36'),
            allPartner: partnerTable.queryItems({Limit: 3, KeyConditionExpression: partnerTable.partitionKey + ' = :email'})
        }
    ).toPromise();

    // const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();
    return {
        statusCode: 200,
        body: res
    };
};
