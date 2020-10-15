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

import * as moment from 'moment';
import {CheckIn} from './domain/checkIn';
import {verifyJWT$} from './util/jwtUtil';
import {qrCodeStorage} from './storages/qrCodeStorage';
import {validationStorage as vs} from './storages/validationStorage';
import {forkJoin, of, throwError} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {DynamodbError, isNotDynamodbError} from './util/dynamoDbDriver';
import {sendVerificationSMS} from './util/smsUtil';
import {checkInStorage} from './storages/checkInStorage';
import {PublishResponse} from 'aws-sdk/clients/sns';
import {Validation} from './domain/validation';
import {ValidationState} from './domain/validationState';
import {CodeValidationError} from './domain/codeValidationError';
import {CheckInError} from './domain/checkInError';
import {QrCodeMapping} from './domain/qrCodeMapping';

var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'visitor-express', src: true});

const port = 3030;

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const {parse} = require('json2csv');


let redirectURL = '.entry-check.ch';
const qrcodestorage = new qrCodeStorage();
const validationstorage = new vs();
const checkinstorage = new checkInStorage();

if (process.env.ENV && process.env.ENV !== 'NONE') {
  if (process.env.ENV === 'dev') redirectURL = 'apidev' + redirectURL;
  if (process.env.ENV === 'prod') redirectURL = 'api' + redirectURL;
} else if (process.env.ENV === undefined) {
  redirectURL = 'apidev' + redirectURL;
}

// Enable CORS for all methods
app.use((req, res, next) => {
  res.header(
      'Access-Control-Allow-Origin',
      '*'
  );
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
  );
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
        res.json({error: 'missing parameter'});
      }
      forkJoin([
        qrcodestorage.findMapping(!!req.body.qrCodeId ? req.body.qrCodeId : 'no code')
                     .pipe(switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a))),
        validationstorage.validateValidationRequest(phoneNumber)
                         .pipe(switchMap((a) => a[0] ? of(a) : throwError(a[1])))
      ]).pipe(
          switchMap(([qrCode, validation]) => {
            const randomNumber = Math.floor(10000 + Math.random() * 90000);
            return forkJoin([
              validationstorage.createValidation(phoneNumber, randomNumber),
              sendVerificationSMS(phoneNumber, qrCode, randomNumber)
            ]);
          }),
          switchMap(([validation, sms]: [Validation | DynamodbError<Validation>, PublishResponse]) =>
              isNotDynamodbError(validation) ?
              of([validation, sms]) :
              throwError(validation))
      ).subscribe(([validation, sms]: [Validation, PublishResponse]) => {
            log.info(validation);
            res.json({timestamp: validation.validation_success, sms: sms});
          },
          (error) => {
            log.error(error);
            if (error instanceof ValidationState) {
              res.status(error.reqStatus);
              res.json({duration: error.interval, status: error.status});
            } else {
              res.status(401);
              res.json({error: 'missing parameter'});
            }
          });
    }
);


app.post('/v1/validate', (req, res) => {
      log.info(req);
      const phoneNumber = req.body.phoneNr;
      const code = req.body.verificationCode;
      if (code && phoneNumber) {
        validationstorage.validateCode(phoneNumber, code).subscribe(
            (token) => {
              log.info(token);
              res.json({token: token});
            },
            (error) => {
              log.error(error);
              if (error instanceof CodeValidationError) {
                res.status(error.errorStatus);
                res.json(error);
              } else {
                res.status(500);
                res.json({error: 'internal server error'});
              }
            }
        );
      } else {
        log.error({err: `missing phonenumber? ${!phoneNumber} - missing code? ${!code}`}, 'missing code or phone number');
        res.status(400);
        res.json({error: 'missing parameter'});
      }
    }
);

app.post('/v1/checkin/:qrId', (req, res) => {
      const isCheckout = req.query.checkOut === 'true';
      log.info((req.query));
      log.info('new checkin...');
      if (!hasRequriredFields(req.body)) {
        res.status(403);
        res.json('missing parameter');
      }
      if (!req.header('Authorization')) {
        const error = CheckInError.create(402, 'token is invalid');
        log.error(error);
        res.status(error.status);
        res.json(error);
      }
      forkJoin([
        verifyJWT$(req.header('Authorization')),
        qrcodestorage.findMapping(req.params.qrId)
      ]).pipe(
          switchMap(([decode, qrcode]) =>
              isNotDynamodbError(qrcode) ? of([decode, qrcode]) : throwError(qrcode)),
          switchMap(([decode, qrcode]) => forkJoin([validationstorage.validateSuccess(decode), of(qrcode), of(decode)])),
          switchMap(([success, qrcode, decode]) => {
            if (!qrcode) {
              return throwError(CheckInError.create(404, 'Location not found'));
            }
            if (success) {
              const timeIso = moment().toISOString();
              let cI = CheckIn.fromReq(req, qrcode, decode, timeIso, isCheckout);
              log.info(qrcode, 'new checkin entry');
              return forkJoin([checkinstorage.createEntry(cI), of(qrcode)]);
            } else {
              return throwError(CheckInError.create(401, 'Token expired'));
            }
          }),
          switchMap(a => isNotDynamodbError(a[0]) ? of(a) : throwError(a[0]))
      ).subscribe(([checkin, qrcode]: [Partial<CheckIn>, QrCodeMapping]) => {
            log.info('checkIn suceeded');
            res.json({
              entry: checkin.checkIn,
              time: checkin.entryTime,
              locationName: qrcode.locationName,
              barId: checkin.locationId,
              locationId: checkin.locationId,
              relatedCheckout: qrcode.relatedCheckOutCode
            });
          },
          error => {
            log.error(error);
            if (error instanceof CheckInError) {
              res.status(error.status);
              res.json(error);
            }
          });
    }
);

const hasRequriredFields = (body): boolean => {
  return !!body.firstName && !!body.surName && !!body.address && !!body.city && !!body.zipcode;
};

app.get('/v1/checkin', (req, res) => {
      log.info(req);
      res.redirect(`https://app.entry-check.ch/?qrCodeUrl=https%3A%2F%2Fapi.entry-check.ch%2Fv1%2Fcheckin%2${encodeURI(req.url)}`);
    }
);

app.get('/v1/checkin/:qrId', (req, res) => {
      log.info(req);
      res.redirect('https://app.entry-check.ch/?qrCodeUrl=https' + encodeURIComponent(`://${redirectURL}${req.originalUrl}`));
    }
);

app.listen(port, () => {log.info(`App started on port ${port}`);});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will
// load the app from
// this file
module.exports = app;
