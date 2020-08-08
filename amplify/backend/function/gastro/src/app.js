/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	AUTH_GASTROVERIFYD8B8759F_USERPOOLID
	ENV
	REGION
	STORAGE_ENTRYSTORAGE_ARN
	STORAGE_ENTRYSTORAGE_NAME
	STORAGE_GASTROSTORAGE_ARN
	STORAGE_GASTROSTORAGE_NAME
	STORAGE_QRCODEMAPPINGSTORAGE_ARN
	STORAGE_QRCODEMAPPINGSTORAGE_NAME
	STORAGE_QRENTRYSTORAGE_ARN
	STORAGE_QRENTRYSTORAGE_NAME
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const gastroRoute = require('./routes/gastroRoute')
const adminRoute = require('./routes/adminRoute')
const entryRoute = require('./routes/entryRoute')
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
const {verifyXIDToken} = require('./jwtUtil')
// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

app.use((req, res, next) => {
    verifyXIDToken(req.header('X-ID-Token')).then(token => {
        req.xUser = token;
        console.log(token)
        next()
    }).catch(error => {
        res.status(401)
        res.json(error)
    })
})


/**********************
 * /gastro*
 **********************/

app.use('/v1/gastro', gastroRoute)

app.use('/v1/admin', adminRoute)

app.use('/v1/entry', entryRoute)


app.listen(3000, function () {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
