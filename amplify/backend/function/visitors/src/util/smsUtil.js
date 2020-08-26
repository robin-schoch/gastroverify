const AWS = require('aws-sdk')
AWS.config.update({region: process.env.AWS_REGION || 'eu-central-1'})
const SNS = new AWS.SNS()

module.exports.sendVerifactionSMS = (phoneNumber, code, senderId="EntryCheck",language = "de") => {
    const params = {
        PhoneNumber: phoneNumber,
        Message: `Dein Verifikationcode ist: ${code}`,
        MessageAttributes: {
            "AWS.SNS.SMS.SenderID" : {
                DataType: "String",
                StringValue: senderId
            }
        },
    }
    return new Promise(((resolve, reject) => {
            SNS.publish(params, (err, data) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    )
}
