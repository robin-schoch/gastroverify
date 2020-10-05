"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const moment = require("moment");
const bill_1 = require("./domain/bill");
const partnerStorage_1 = require("./storage/partnerStorage");
const reportStorage_1 = require("./storage/reportStorage");
const monthlyReportStorage_1 = require("./storage/monthlyReportStorage");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const dynamoDbDriver_1 = require("./util/dynamoDbDriver");
const locationStorage_1 = require("./storage/locationStorage");
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'monthlyReport', src: true });
const partnerstorage = new partnerStorage_1.partnerStorage();
const locationstorage = new locationStorage_1.locationStorage();
const createBillForPartner = async (from, to, partner) => {
    const locations = await locationstorage.findLocations(partner.email).pipe(operators_1.switchMap((a) => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a.Data) : rxjs_1.throwError(a))).toPromise();
    return new Promise((async (resolve, reject) => {
        const reports = await Promise.all(locations.map(location => createBillForLocation(from, to, location)));
        const billInfo = reports.reduce((acc, report) => billReducer(acc, report.res), {
            distinctTotal: 0,
            total: 0,
            price: 0,
            location: ''
        });
        const bill = bill_1.billBuilder(partner.email, from.toISOString(), to.toISOString(), billInfo.total, billInfo.distinctTotal, billInfo.price, partner, reports.map((report) => report.res), reports.map((reports) => Object.assign({}, reports.res, {
            detail: reports.original.map(det => {
                return {
                    reportDate: det.reportDate,
                    distinctTotal: det.distinctTotal,
                    price: det.distinctTotal * det.pricePerEntry
                };
            })
        })));
        // create pdf
        monthlyReportStorage_1.createBill(bill).then(elem => {
            resolve(bill);
        });
        // createBillPDF(bill, bill.detail);
    }));
};
const createBillForLocation = async (from, to, location) => {
    return new Promise(async (resolve, reject) => {
        let data = await reportStorage_1.getReports(location.locationId, from, to).catch(err => log.error(err));
        resolve({
            res: Object.assign({}, data.Items.reduce((acc, item) => reportReducer(acc, item), {
                distinctTotal: 0,
                total: 0,
                price: 0,
                location: ''
            }), { name: location.name }),
            original: data.Items
        });
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
    log.info('running');
    const creationTime = moment()
        .subtract(1, 'month')
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0);
    let startOfBillingDuration = moment().subtract(1, 'month').startOf('month');
    let endOfBillingDuration = moment().subtract(1, 'month').endOf('month');
    //let startOfBillingDuration = moment().startOf('month')
    //let endOfBillingDuration = moment().endOf('month')
    let lastEvaluatedPartnerKey = null;
    let partnerList = [];
    do {
        let partners = await partnerstorage.findPartnerPaged()
            .pipe(operators_1.switchMap((a) => dynamoDbDriver_1.isNotDynamodbError(a) ?
            rxjs_1.of(a) :
            rxjs_1.throwError(a))).toPromise().catch(err => log.error(err));
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey ? partners.LastEvaluatedKey : null;
        partnerList = [
            ...partnerList,
            ...partners.Data.map(p => createBillForPartner(startOfBillingDuration.clone(), endOfBillingDuration.clone(), p))
        ];
    } while (!!lastEvaluatedPartnerKey);
    await Promise.all(partnerList);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
