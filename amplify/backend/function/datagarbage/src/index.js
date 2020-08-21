/* Amplify Params - DO NOT EDIT
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
Amplify Params - DO NOT EDIT */
const {scanPartner} = require('./storage/partnerStorage')
const {clearData} = require('./storage/entryStorage')
exports.handler = async (event) => {

    console.log("handle bills usw.")

    /*let lastEvaluatedPartnerKey = null

    do {
        let partners = await scanPartner(lastEvaluatedPartnerKey)
        lastEvaluatedPartnerKey = partners.LastEvaluatedKey
        partners.Items.forEach(partner => clearData(partner))

    }while (!!lastEvaluatedPartnerKey)*/
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };




    return response;
};
