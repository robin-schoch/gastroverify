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
import {filter, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

const mapper = (location, email) => {
    return {
        partnerId: email,
        locationId: location.locationId,

        street: location.street,
        zipcode: location.zipcode,
        city: location.city,

        active: location.active,
        checkInCode: location.checkInCode,
        checkOutCode: location.checkOutCode,
        name: location.name,
        payment: !!location.payment ? location.payment : 'default',
        type: !!location.type ? location.type : 'Tisch',


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


        const listOfPartner = await partnerTable.scanItems({}).pipe(
            filter(elem => isNotDynamodbError(elem)),
            map((elem: Page<any>) => elem.Data),
        ).toPromise();


        listOfPartner.map(partner => partner.locations.map(l => mapper(
            l,
            partner.email
        ))).forEach(elem => {
            console.log(elem.length);
            res = [
                ...res,
                ...elem
            ];
        });

        const result = await forkJoin(res.map(d => locationTable.putItem(d))).toPromise();

        return {
            statusCode: 200,
            body: {
                size: result.length,
                res: result
            }
        };

// const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();

    }
;
