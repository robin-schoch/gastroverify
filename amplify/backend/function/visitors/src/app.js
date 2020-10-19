"use strict";
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
 Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
Object.defineProperty(exports, "__esModule", { value: true });
/* Amplify Params - DO NOT EDIT

 Amplify Params - DO NOT EDIT */
const moment = require("moment");
const checkIn_1 = require("./domain/checkIn");
const jwtUtil_1 = require("./util/jwtUtil");
const qrCodeStorage_1 = require("./storages/qrCodeStorage");
const validationStorage_1 = require("./storages/validationStorage");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const dynamoDbDriver_1 = require("./util/dynamoDbDriver");
const smsUtil_1 = require("./util/smsUtil");
const checkInStorage_1 = require("./storages/checkInStorage");
const validationState_1 = require("./domain/validationState");
const codeValidationError_1 = require("./domain/codeValidationError");
const checkInError_1 = require("./domain/checkInError");
var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'visitor-express', src: true });
const port = 3030;
// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
const { parse } = require('json2csv');
let redirectURL = '.entry-check.ch';
const qrcodestorage = new qrCodeStorage_1.qrCodeStorage();
const validationstorage = new validationStorage_1.validationStorage();
const checkinstorage = new checkInStorage_1.checkInStorage();
if (process.env.ENV && process.env.ENV !== 'NONE') {
    if (process.env.ENV === 'dev')
        redirectURL = 'apidev' + redirectURL;
    if (process.env.ENV === 'prod')
        redirectURL = 'api' + redirectURL;
}
else if (process.env.ENV === undefined) {
    redirectURL = 'apidev' + redirectURL;
}
// Enable CORS for all methods
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
/**********************
 * Example get method *
 **********************/
/****************************
 * Example post method      *
 ****************************/
app.post('/v1/register', (req, res) => {
    log.info(req);
    const phoneNumber = req.body.phoneNr;
    if (phoneNumber === null) {
        res.status(401);
        res.json({ error: 'missing parameter' });
    }
    rxjs_1.forkJoin([
        qrcodestorage.findMapping(!!req.body.qrCodeId ? req.body.qrCodeId : 'no code')
            .pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a))),
        validationstorage.validateValidationRequest(phoneNumber)
            .pipe(operators_1.switchMap((a) => a[0] ? rxjs_1.of(a) : rxjs_1.throwError(a[1])))
    ]).pipe(operators_1.switchMap(([qrCode, validation]) => {
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        return rxjs_1.forkJoin([
            validationstorage.createValidation(phoneNumber, randomNumber),
            smsUtil_1.sendVerificationSMS(phoneNumber, qrCode, randomNumber)
        ]);
    }), operators_1.switchMap(([validation, sms]) => dynamoDbDriver_1.isNotDynamodbError(validation) ?
        rxjs_1.of([validation, sms]) :
        rxjs_1.throwError(validation))).subscribe(([validation, sms]) => {
        log.info(validation);
        res.json({ timestamp: validation.validation_success, sms: sms });
    }, (error) => {
        log.error(error);
        if (error instanceof validationState_1.ValidationState) {
            res.status(error.reqStatus);
            res.json({ duration: error.interval, status: error.status });
        }
        else {
            res.status(401);
            res.json({ error: 'missing parameter' });
        }
    });
});
app.post('/v1/validate', (req, res) => {
    log.info(req);
    const phoneNumber = req.body.phoneNr;
    const code = req.body.verificationCode;
    if (code && phoneNumber) {
        validationstorage.validateCode(phoneNumber, code).subscribe((token) => {
            log.info(token);
            res.json({ token: token });
        }, (error) => {
            log.error(error);
            if (error instanceof codeValidationError_1.CodeValidationError) {
                res.status(error.errorStatus);
                res.json(error);
            }
            else {
                res.status(500);
                res.json({ error: 'internal server error' });
            }
        });
    }
    else {
        log.error({ err: `missing phonenumber? ${!phoneNumber} - missing code? ${!code}` }, 'missing code or phone number');
        res.status(400);
        res.json({ error: 'missing parameter' });
    }
});
app.post('/v1/checkin/:qrId', (req, res) => {
    const isCheckout = req.query.checkOut === 'true';
    log.info((req.query));
    log.info('new checkin...');
    if (!hasRequriredFields(req.body)) {
        res.status(403);
        res.json('missing parameter');
    }
    if (!req.header('Authorization')) {
        const error = checkInError_1.CheckInError.create(402, 'token is invalid');
        log.error(error);
        res.status(error.status);
        res.json(error);
    }
    rxjs_1.forkJoin([
        jwtUtil_1.verifyJWT$(req.header('Authorization')),
        qrcodestorage.findMapping(req.params.qrId)
    ]).pipe(operators_1.switchMap(([decode, qrcode]) => dynamoDbDriver_1.isNotDynamodbError(qrcode) ? rxjs_1.of([decode, qrcode]) : rxjs_1.throwError(qrcode)), operators_1.switchMap(([decode, qrcode]) => rxjs_1.forkJoin([validationstorage.validateSuccess(decode), rxjs_1.of(qrcode), rxjs_1.of(decode)])), operators_1.switchMap(([success, qrcode, decode]) => {
        if (!qrcode) {
            return rxjs_1.throwError(checkInError_1.CheckInError.create(404, 'Location not found'));
        }
        if (success) {
            const timeIso = moment().toISOString();
            let cI = checkIn_1.CheckIn.fromReq(req, qrcode, decode, timeIso, isCheckout);
            log.info(qrcode, 'new checkin entry');
            return rxjs_1.forkJoin([checkinstorage.createEntry(cI), rxjs_1.of(qrcode)]);
        }
        else {
            return rxjs_1.throwError(checkInError_1.CheckInError.create(401, 'Token expired'));
        }
    }), operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a[0]) ? rxjs_1.of(a) : rxjs_1.throwError(a[0]))).subscribe(([checkin, qrcode]) => {
        log.info('checkIn suceeded');
        res.json({
            entry: checkin.checkIn,
            time: checkin.entryTime,
            locationName: qrcode.locationName,
            barId: checkin.locationId,
            locationId: checkin.locationId,
            relatedCheckout: qrcode.relatedCheckOutCode
        });
    }, error => {
        log.error(error);
        if (error instanceof checkInError_1.CheckInError) {
            res.status(error.status);
            res.json(error);
        }
    });
});
const hasRequriredFields = (body) => {
    return !!body.firstName && !!body.surName && !!body.address && !!body.city && !!body.zipcode;
};
app.get('/v1/checkin', (req, res) => {
    log.info(req);
    res.redirect(`https://app.entry-check.ch/?qrCodeUrl=https%3A%2F%2Fapi.entry-check.ch%2Fv1%2Fcheckin%2${encodeURI(req.url)}`);
});
app.get('/v1/checkin/:qrId', (req, res) => {
    log.info(req);
    res.redirect('https://app.entry-check.ch/?qrCodeUrl=https' + encodeURIComponent(`://${redirectURL}${req.originalUrl}`));
});
app.listen(port, () => { log.info(`App started on port ${port}`); });
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will
// load the app from
// this file
module.exports = app;
