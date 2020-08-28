/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BILLING_ARN
	STORAGE_BILLING_NAME
	STORAGE_DAILYREPORT_ARN
	STORAGE_DAILYREPORT_NAME
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_MONTHLYREPORT_ARN
	STORAGE_MONTHLYREPORT_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
Amplify Params - DO NOT EDIT */
const {scanPartner} = require('./storage/partnerStorage')
const {getReports} = require('./storage/reportStorage')
const {createBill} = require('./storage/monthlyReportStorage')
const moment = require('moment');
const {billBuilder} = require("./domain/bill");

const createBillForPartner = async (from, to, partner) => {
    return new Promise((async (resolve, reject) => {
        const reports = await Promise.all(partner.locations.map(location => createBillForLocation(from, to, location)))
        const billInfo = reports.reduce((acc, report) => billReducer(acc, report), {distinctTotal: 0, total: 0, price: 0})
        const bill = billBuilder(partner.email, from.toISOString(), to.toISOString(), billInfo.total, billInfo.distinctTotal, billInfo.price)
        createBill(bill).then(elem => {
            resolve(true)
        })
    }))


}

const createBillForLocation = async (from, to, location) => {
    return new Promise(async (resolve, reject) => {
        console.log("next location")
        console.log(location)
        let data = await getReports(location.locationId, from, to).catch(err => console.log(err))
        resolve(data.Items.reduce((acc, item) => reportReducer(acc, item), {distinctTotal: 0, total: 0, price: 0}))

    })

}

const reportReducer = (report, acc) => {
    return {distinctTotal: acc.distinctTotal + report.distinctTotal, total: acc.distinctTotal + report.distinctTotal, price:  acc.price + (report.distinctTotal * (!!report.price ? report.price : 0.15))}
}

const billReducer = (bill, acc) => {
    return {distinctTotal: acc.distinctTotal + bill.distinctTotal, total: acc.distinctTotal + bill.distinctTotal, price:  acc.price +  bill.price}
}

exports.handler = async (event) => {

    const creationTime = moment()
        .subtract(1, 'month')
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)

    console.log("handle bills usw.")
    console.log(creationTime.toISOString())
    let a = moment().subtract(1, 'month')
    let startOfBillingDuration = moment().subtract(1, 'month').startOf('month')
    let endOfBillingDuration = moment().subtract(1, 'month').endOf('month')
    let lastEvaluatedPartnerKey = null
    let partnerList = []
    do {
        let partners = await scanPartner(lastEvaluatedPartnerKey).catch(err => console.log(err))
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey ? partners.LastEvaluatedKey : null
        partnerList = [...partnerList, ...partners.Items.map(p => createBillForPartner(startOfBillingDuration.clone(), endOfBillingDuration.clone(), p))]
    } while (!!lastEvaluatedPartnerKey)
    await Promise.all(partnerList)
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};


