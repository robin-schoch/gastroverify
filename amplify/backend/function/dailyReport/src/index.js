/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_DAILYREPORT_ARN
	STORAGE_DAILYREPORT_NAME
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
Amplify Params - DO NOT EDIT */

const {scanPartner} = require('./storage/partnerStorage')
const {getEntries} = require('./storage/entryStorage')
const {createNewReport} = require('./storage/reportStorage')
const moment = require('moment');

const prices = {
    premium: 0.3,
    default: 0.15
}

const createReportForPartner = async (date, partner) => {
    return Promise.all(partner.locations.map(location => createReportForLocation(date.clone(), location)))
}

const createReportForLocation = async (date, location) => {
    return new Promise(async (resolve, reject) => {
        console.log("next location")
        console.log(location)
        let vals = []
        let lastkey = null
        do {
            console.log("getting data")
            let data = await getEntries(location.locationId, date.clone(), 10000, lastkey).catch(err => console.log(err))
            console.log(data.value)
            if (!!data.value) {
                vals = [...data.value.map(elem => elem.phoneNumber), ...vals]
                lastkey = data.lastEvaluatedKey ? data.lastEvaluatedKey : null
            }
        } while (lastkey !== null)
        let count = new Set(vals).size
        let totalCount = vals.length
        console.log("count " + count + " total " + totalCount)
        count > 0 ? console.log("Report create for : " + location.locationId + " ") : console.log("no entries for : " + location.locationId)
        await createNewReport(location.locationId, date.toISOString(), count, totalCount, !!location.senderID ? prices.premium : prices.default ).catch(err => console.log(err))
        resolve(true)
    })

}


exports.handler = async (event) => {

    const creationTime = moment()
        .minutes(0)
        .seconds(0)
        .milliseconds(0)

    console.log("handle reports usw.")
    console.log(creationTime.toISOString())
    const dat = creationTime.clone()


    let lastEvaluatedPartnerKey = null
    let partnerList = []
    do {
        let partners = await scanPartner(lastEvaluatedPartnerKey).catch(err => console.log(err))
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey ? partners.LastEvaluatedKey : null
        partnerList = [...partnerList, ...partners.Items.map(p => createReportForPartner(creationTime, p))]
    } while (!!lastEvaluatedPartnerKey)
    await Promise.all(partnerList)
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};


