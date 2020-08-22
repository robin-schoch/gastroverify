/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_BILLING_ARN
	STORAGE_BILLING_NAME
	STORAGE_DAILYREPORT_ARN
	STORAGE_DAILYREPORT_NAME
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
Amplify Params - DO NOT EDIT */
const {scanPartner} = require('./storage/partnerStorage')
const {getEntries} = require('./storage/entryStorage')
const {createNewDailyBill} = require('./storage/billingStorage')
const {createNewReport} = require('./storage/reportStorage')
const moment = require('moment');

const createReportForPartner = async (date, partner) => {
    partner.locations.forEach(location => createReportForLocation(date, location))
}

const createReportForLocation = async (date, location) => {

    let vals = []
    let lastkey = null
    do {
        let data = await getEntries(location.locationId, date, 10000, lastkey).catch(err => console.log(err))
        vals = [...data.Items, ...vals]
        lastkey = data.LastEvaluatedKey
    } while (lastkey === null)
    let count = new Set(vals).size
    let totalCount = vals.length
    if (count > 0) {
        await createNewReport(location.locationId, date.toISOString(), count, totalCount).catch(err => console.log(err))
        console.log("Report create for : " + location.locationId)
    } else {
        console.log("no entries for : " + location.locationId)
    }
}

const createMonthlyBill = () => {
    console.log("create bill")
}


exports.handler = async (event) => {

    const creationTime = moment()
        .minutes(0)
        .seconds(0)
        .milliseconds(0)

    console.log("handle bills usw.")
    console.log(creationTime.toISOString())

    const isSecondDayOfMonth = Number(creationTime.format('DD')) === 2

    if (isSecondDayOfMonth) {
        createMonthlyBill()
    }


    let lastEvaluatedPartnerKey = null

    do {
        let partners = await scanPartner(lastEvaluatedPartnerKey)
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey
        partners.Items.forEach(partner => createReportForPartner(creationTime, partner))

    } while (!!lastEvaluatedPartnerKey)
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};


