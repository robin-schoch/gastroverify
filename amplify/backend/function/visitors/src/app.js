/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_ENTRANCE_ARN
	STORAGE_ENTRANCE_NAME
	STORAGE_PARTNER_ARN
	STORAGE_PARTNER_NAME
	STORAGE_QRMAPPING_ARN
	STORAGE_QRMAPPING_NAME
	STORAGE_VALIDATION_ARN
	STORAGE_VALIDATION_NAME
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT

Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const moment = require('moment');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "visitor-express", src: true});

const port = 3030;

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

const {parse} = require('json2csv');

const validationStorage = require('./storages/validationStorage')
const jwtUtil = require('./util/jwtUtil')
const CheckIn = require('./domain/checkIn')
const checkinStorage = require('./storages/checkInStorage')
const {getQrCode} = require('./storages/qrCodeStorage')

let redirectURL = ".entry-check.ch"
if (process.env.ENV && process.env.ENV !== "NONE") {
    if (process.env.ENV === "dev") redirectURL = "apidev" + redirectURL
    if (process.env.ENV === "prod") redirectURL = "api" + redirectURL
} else if (process.env.ENV === undefined) {
    redirectURL = "apidev" + redirectURL
}

// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


/**********************
 * Example get method *
 **********************/


/****************************
 * Example post method      *
 ****************************/


app.post('/v1/register', (req, res) => {
    const phoneNumber = req.body.phoneNr;
    if (phoneNumber) {
        const p = []
        if (req.body.qrCodeId) {
            p.push(getQrCode(req.body.qrCodeId))
        }
        log.info({
            qrCodeId: req.body.qrCodeId
        }, "new registration");
        p.push(validationStorage.validateValidationRequest(phoneNumber))
        Promise.all(p).then(b => {
            let senderID = "EntryCheck"
            let text = 'Dein Verifikationcode ist:'

            if (b.length === 2 && b[0].hasOwnProperty("senderID")) {
                senderID = b[0].senderID
            }
            if (b.length === 2 && b[0].hasOwnProperty("smsText")) {
                text = b[0].smsText
            }
            validationStorage.createValidation(phoneNumber, senderID, text).then(([valid, sms]) => {
                res.json({timestamp: valid.validation_requested, sms: sms})
            }).catch(error => {
                res.status(500)
                log.fatal({err: error})
                res.json({error: error})
            })
        }).catch(error => {
            if (error.hasOwnProperty('interval')) {
                log.error({err: error}, "user is blocked and must wait")
                res.status(403)
                res.json({duration: error.interval, status: error.status})
            } else {
                log.error({err: error}, "could not find qr code premium mapping")
                res.status(403)
                res.json({duration: 60, status: 'premium'})
            }
        })
    } else {
        log.error({err: error}, "no phonenumber")
        res.status(401)
        res.json({error: "missing parameter"})
    }
});


app.post('/v1/validate', function (req, res) {
    const phoneNumber = req.body.phoneNr;
    const code = req.body.verificationCode;
    if (code && phoneNumber) {
        validationStorage.validateNumber(phoneNumber, code).then(token => {
            res.status(200)
            res.json({token: token})
        }).catch(err => {
            if (err.error === "no validation request") res.status(404)
            if (err.error === "validation blocked") res.status(403)
            if (err.error === "invalid code") res.status(401)
            log.error({err: err}, "error validating")
            res.json(err)
        })
    } else {
        log.error({err: `missing phonenumber? ${!phoneNumber} - missing code? ${!code}` }, "missing code or phone number")
        res.status(400)
        res.json({erorr: "missing parameter"})
    }
});

app.post('/v1/checkin/:qrId', function (req, res) {
    log.info("new checkin...")
    jwtUtil.verifyJWT(req.header('Authorization')).then(async decoded => {
        const valid = await validationStorage.validationSuccess(decoded.phone, decoded.validation)
        log.info(`user has valid token = ${valid}`)
        if (valid) {
            getQrCode(req.params.qrId).then(code => {
                const timeIso = moment().toISOString()
                let cI = new CheckIn(code.locationId, req.body.firstName, req.body.surName,
                    !!req.body.email ? req.body.email : "no email", req.body.address, req.body.city, req.body.zipcode,
                    code.checkIn, timeIso, decoded.phone, req.body.birthdate, req.body.firstUse, req.query.table)
                log.info({
                    locationId: code.locationId,
                    locationName: code.locationName,
                    checkIn: code.checkIn
                }, "new checkin entry")
                checkinStorage.addCheckIn(cI).then(elem => {
                    log.info("checkIn suceeded")
                    res.json({
                        entry: code.checkIn,
                        time: timeIso,
                        locationName: code.locationName,
                        barId: code.locationId,
                        locationId: code.locationId
                    })
                }).catch(error => {
                    log.fatal({err: error}, "shit")
                    res.status(500)
                    res.json({error: "internal error 69"})
                })
            }).catch(err => {
                res.status(404)
                log.error({err: err}, "location not found")
                res.json({error: "location not found"})
            })
        } else {
            log.error({err: "token expired"}, "token")
            res.status(401)
            res.json({error: "token is expired"})
        }
    }).catch(err => {
        log.error({err: err}, "token could not be validaded")
        res.status(402)
        res.json({error: "token is invalid"})
    })
});

app.get('/v1/checkin', function (req, res) {
    res.redirect(`https://app.entry-check.ch/?qrCodeUrl=https%3A%2F%2Fapi.entry-check.ch%2Fv1%2Fcheckin%2${encodeURI(req.url)}`)
});

app.get('/v1/checkin/:qrId', function (req, res) {
    // res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl`)
    res.redirect('https://app.entry-check.ch/?qrCodeUrl=https' + encodeURIComponent(`://${redirectURL}${req.originalUrl}`))
});


app.listen(port, function () {
    log.info(`App started on port ${port}`)
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will
// load the app from
// this file
module.exports = app
