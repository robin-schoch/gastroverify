"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dynamoDbDriver_1 = require("./domain/dynamoDbDriver");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
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
exports.handler = async (event, context) => {
    const partnerTable = new dynamoDbDriver_1.DbConnection('Partner', 'email');
    const locationTable = new dynamoDbDriver_1.DbConnection('Location', 'partnerId', 'locationId');
    let res = [];
    const listOfPartner = await partnerTable.scanItems({}).pipe(operators_1.filter(elem => dynamoDbDriver_1.isNotDynamodbError(elem)), operators_1.map((elem) => elem.Data)).toPromise();
    listOfPartner.map(partner => partner.locations.map(l => mapper(l, partner.email))).forEach(elem => {
        console.log(elem.length);
        res = [
            ...res,
            ...elem
        ];
    });
    const result = await rxjs_1.forkJoin(res.map(d => locationTable.putItem(d))).toPromise();
    return {
        statusCode: 200,
        body: {
            size: result.length,
            res: result
        }
    };
    // const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();
};
