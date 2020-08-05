const AWS = require('aws-sdk')
AWS.config.update({region: process.env.AWS_REGION || 'eu-central-1'})
const SNS = new AWS.SNS()

module.exports.sendVerifactionSMS = (phoneNumber, code, language = "de") => {
    const params = {
        PhoneNumber: phoneNumber,
        Message: `Dein Verifikationcode ist: ${code}`
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
