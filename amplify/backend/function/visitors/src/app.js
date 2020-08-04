/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_CHECKINSTORAGE_ARN
	STORAGE_CHECKINSTORAGE_NAME
	STORAGE_VALIDATIONSTORAGE_ARN
	STORAGE_VALIDATIONSTORAGE_NAME
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


const port = 3030;

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())


const validation = require('./validationStorage')
const smsUtil = require('./smsUtil')

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
 * Example post method *
 ****************************/

app.post('/v1/send', (req, res) => {
    smsUtil.sendVerifactionSMS("+41764235351", 1232).then(data => res.json({data: data})).catch(error => res.json({errr: error}))
})

app.post('/v1/register', (req, res) => {
    const phoneNumber = req.body.phoneNr;
    if (phoneNumber) {
        validation.validateValidationRequest(phoneNumber).then(_ => {
            validation.createValidation(phoneNumber).then(valid => {
                res.json({timestamp: valid.validation_requested})
            }).catch(error => {
                res.status(500)
                console.log(error)
                res.json({error: error})
            })
        }).catch(error => {
            res.status(400)
            res.json({timestamp: error.interval})
        })
    } else {
        res.status(401)
        res.json({erorr: "missing parameter"})
    }
});

app.post('/v1/validate', function (req, res) {
    const phoneNumber = req.body.phoneNr;
    const code = req.body.verificationCode;
    if (code && phoneNumber) {
        validation.validateNumber(phoneNumber, code).then(token => {
            res.status(200)
            res.json({token: token})
        }).catch(err => {
            res.status(403)
            res.json({error: err})
        })

    } else {
        res.status(400)
        res.json({erorr: "missing parameter"})
    }

});

app.post('/v1/:barId', function (req, res) {
    res.json({success: 'post call succeed!', url: req.url, barId: req.params.barId, checkIn: req.query.checkIn})
});

app.get('/v1/:barId', function (req, res) {
    // Add your code here
    console.log("hello")
    res.json({success: 'redirect to app', url: req.url});
});


app.listen(port, function () {
    console.log(`App started on port ${port}`)
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
