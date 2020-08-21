/* Amplify Params - DO NOT EDIT
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
Amplify Params - DO NOT EDIT */
const {scanPartner} = require('./storage/partnerStorage')
const {getEntries} = require('./storage/entryStorage')
const {createNewDailyBill} = require('./storage/billingStorage')
const moment = require('moment');

const createBillForDayPartner = async (date, partner) => {
    partner.locations.forEach(location => createBillForDayLocation(date, location))
}

const createBillForDayLocation = async (date, location, isFirstOfMoth) => {
    let billDate = date.format('MM/YYYY')
    let d = date.format('DD')
    /* if (isFirstOfMoth) {
         finishBill(location.locationId, date.subtract(1, 'month').format('MM/YYYY')).catch(err => console.log(err))
         createNewBill(location.locationId, d).catch(err => console.log(err))
     }*/
    let vals = []
    let lastkey = null
    do {
        let {val, key} = await getEntries(location.locationId, creationtime, 10000, lastkey).catch(err => console.log(err))
        vals = [...val, ...vals]
        lastkey = key
    } while (lastkey === null)
    let count = new Set(vals).size

    if (count > 0) {
        await createNewDailyBill(location.locationId, date.toISOString(), count).catch(err => console.log(err))
        //  await updateBill(location.locationId, billDate, d, count).catch(err => console.log(err))
    }


}


exports.handler = async (event) => {

    const creationTime = moment()
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)

    console.log("handle bills usw.")

    const isfirstOfTheMonth = Number(creationTime.format('DD')) === 1


    let lastEvaluatedPartnerKey = null

    do {
        let partners = await scanPartner(lastEvaluatedPartnerKey)
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey
        partners.Items.forEach(partner => createBillForDayPartner(creationTime, partner, isfirstOfTheMonth))

    } while (!!lastEvaluatedPartnerKey)
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };


    return response;
};


