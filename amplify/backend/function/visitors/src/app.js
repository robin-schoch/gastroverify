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
        validationStorage.validateValidationRequest(phoneNumber).then(b => {
            validationStorage.createValidation(phoneNumber).then(([valid, sms]) => {
                console.log(sms)
                res.json({timestamp: valid.validation_requested, sms: sms})
            }).catch(error => {
                res.status(500)
                console.log(error)
                res.json({error: error})
            })
        }).catch(error => {
            res.status(403)
            res.json({duration: error.interval, status: error.status})
        })
    } else {
        res.status(401)
        res.json({error: "missing parameter"})
    }
});

app.post('/v1/register/noSMS', (req, res) => {
    const phoneNumber = req.body.phoneNr;

    if (phoneNumber) {
        validationStorage.validateValidationRequest(phoneNumber).then(loaded => {
            validationStorage.createValidation(phoneNumber).then(([valid, sms]) => {
                res.json({success: "check your phone"})
            }).catch(error => {
                res.status(500)
                console.log(error)
                res.json({error: "internal server error 69"})
            })
        }).catch(error => {
            res.status(403)
            res.json({
                error: {
                    duration: error.interval,
                    status: error.status
                }
            })
        })
    } else {
        res.status(400)
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

            res.json(err)
        })
    } else {
        res.status(400)
        res.json({erorr: "missing parameter"})
    }
});

app.post('/v1/checkin/:qrId', function (req, res) {
    console.log("checkIn...")
    jwtUtil.verifyJWT(req.header('Authorization')).then(async decoded => {
        const valid = await validationStorage.validationSuccess(decoded.phone, decoded.validation)
        console.log("is valid: " + valid)
        if (valid) {
            getQrCode(req.params.qrId).then(code => {
                const timeIso = moment().toISOString()
                let cI = new CheckIn(code.locationId, req.body.firstName, req.body.surName,
                    req.body.email, req.body.address, req.body.city, req.body.zipcode,
                    code.checkIn, timeIso, decoded.phone, req.body.firstUse)
                console.log("created user")
                checkinStorage.addCheckIn(cI).then(elem => {
                    res.json({
                        entry: code.checkIn,
                        time: timeIso,
                        locationName: code.locationName,
                    })
                }).catch(error => {
                    res.status(500)
                    res.json({error: "internal error 69"})
                })
            }).catch(err => {
                res.status(404)
                console.log("error")
                console.log(err)
                res.json({error: "location not found"})
            })
        } else {
            res.status(401)
            res.json({error: "token is expired"})
        }
    }).catch(err => {
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
    console.log(`App started on port ${port}`)
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will
// load the app from
// this file
module.exports = app
