/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_DAILYREPORT_ARN
 STORAGE_DAILYREPORT_NAME
 STORAGE_ENTRANCE_ARN
 STORAGE_ENTRANCE_NAME
 STORAGE_LOCATION_ARN
 STORAGE_LOCATION_NAME
 STORAGE_MONTHLYREPORT_ARN
 STORAGE_MONTHLYREPORT_NAME
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 Amplify Params - DO NOT EDIT */
import * as moment from 'moment';
import {billBuilder} from './domain/bill';
import {partnerStorage} from './storage/partnerStorage';

import {getReports} from './storage/reportStorage';
import {createBill} from './storage/monthlyReportStorage';

import {map, switchMap} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {Partner} from './domain/partner';
import {DynamodbError, isNotDynamodbError, Page} from './util/dynamoDbDriver';
import {locationStorage} from './storage/locationStorage';

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'monthlyReport', src: true});
const partnerstorage = new partnerStorage();
const locationstorage = new locationStorage();


const createBillForPartner = async (from, to, partner) => {

    const locations = await locationstorage.findLocations(partner.email).pipe(
        switchMap((a) => isNotDynamodbError<Page<any>>(a) ? of(a.Data) : throwError(a)),
    ).toPromise();
    return new Promise((async (resolve, reject) => {
        const reports = await Promise.all(locations.map(location => createBillForLocation(
            from,
            to,
            location
        )));

        const billInfo: any = reports.reduce(
            (acc, report: any) => billReducer(
                acc,
                report.res
            ),
            {
                distinctTotal: 0,
                total: 0,
                price: 0,
                location: ''
            }
        );

        const bill = billBuilder(
            partner.email,
            from.toISOString(),
            to.toISOString(),
            billInfo.total,
            billInfo.distinctTotal,
            billInfo.price
        );
        console.log(bill);
        // create pdf
        createBill(bill).then(elem => {
            resolve(bill);
        });
    }));


};

const createBillForLocation = async (from, to, location) => {
    return new Promise(async (resolve, reject) => {

        let data: any = await getReports(
            location.locationId,
            from,
            to
        ).catch(err => log.error(err));
        resolve({
                res: data.Items.reduce(
                    (acc, item) => reportReducer(
                        acc,
                        item
                    ),
                    {
                        distinctTotal: 0,
                        total: 0,
                        price: 0,
                        location: ''
                    }
                ),
                original: data.Items
            }
        );

    });

};

const reportReducer = (acc, report) => {

    return {
        distinctTotal: acc.distinctTotal + report.distinctTotal,
        total: acc.total + report.total,
        price: acc.price + (report.distinctTotal * (!!report.pricePerEntry ? report.pricePerEntry : 0.15)),
        location: report.locationId
    };
};

const billReducer = (acc, bill) => {
    return {
        distinctTotal: acc.distinctTotal + bill.distinctTotal,
        total: acc.total + bill.total,
        price: acc.price + bill.price,
        location: bill.location
    };
};

exports.handler = async (event) => {

    const creationTime = moment()
        .subtract(
            1,
            'month'
        )
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0);

    let startOfBillingDuration = moment().subtract(
        1,
        'month'
    ).startOf('month');
    let endOfBillingDuration = moment().subtract(
        1,
        'month'
    ).endOf('month');
    //let startOfBillingDuration = moment().startOf('month')
    //let endOfBillingDuration = moment().endOf('month')

    let lastEvaluatedPartnerKey = null;
    let partnerList = [];
    do {
        let partners: Page<Partner> = await partnerstorage.findPartnerPaged()
                                                          .pipe(
                                                              switchMap((a: Page<Partner> | DynamodbError<Partner>) => isNotDynamodbError<Page<Partner>>(a) ?
                                                                                                                       of(a) :
                                                                                                                       throwError(a)),
                                                          ).toPromise().catch(err => log.error(err));

        lastEvaluatedPartnerKey = partners.LastEvaluatedKey ? partners.LastEvaluatedKey : null;
        partnerList = [
            ...partnerList,
            ...partners.Data.map(p => createBillForPartner(
                startOfBillingDuration.clone(),
                endOfBillingDuration.clone(),
                p
            ))
        ];
    } while (!!lastEvaluatedPartnerKey);
    await Promise.all(partnerList);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};


