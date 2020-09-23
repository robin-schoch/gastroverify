/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_LOCATION_ARN
 STORAGE_LOCATION_NAME
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 STORAGE_QRMAPPING_ARN
 STORAGE_QRMAPPING_NAME
 Amplify Params - DO NOT EDIT */

import {DbConnection, isNotDynamodbError, Page} from './domain/dynamoDbDriver';
import {filter, map, tap} from 'rxjs/operators';

const mapper = (location, email) => {
    return {
        partnerId: email,
        locationId: location.locationId,
        active: location.active,
        checkInCode: location.checkInCode,
        checkOutCode: location.checkOutCode,
        city: location.city,
        name: location.name,
        payment: location.payment,
        street: location.street,
        type: !!location.type ? location.type : 'Tisch',
        zipcode: location.zipcode

    };
};

export const handler = async (event, context) => {

    const partnerTable = new DbConnection(
        'Partner',
        'email'
    );

    const locationTable = new DbConnection(
        'Location',
        'partnerId',
        'locationId'
    );
    let res = [];

    console.log(partnerTable.tableName);

    partnerTable.scanItems({}).subscribe(elem => {
        console.log('i did scan table and found this: ');
        console.log(elem);
    });


    partnerTable.scanItems({}).pipe(
        tap(elem => console.log(elem)),
        filter(elem => isNotDynamodbError(elem)),
        map((elem: Page<any>) => elem.Data),
    ).toPromise().then((listOfPartner: any[]) => {
        console.log(listOfPartner);
        listOfPartner.map(partner => partner.locations.map(l => mapper(
            l,
            partner.email
        ))).forEach(elem => {
            console.log(elem);
            res = [
                ...res,
                ...elem
            ];
        });
        return {
            statusCode: 200,
            body: res
        };
    });

    // const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();

};
