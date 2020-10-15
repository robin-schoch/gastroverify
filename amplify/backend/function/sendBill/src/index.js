"use strict";
/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_MONTHLYREPORT_ARN
 STORAGE_MONTHLYREPORT_NAME
 Amplify Params - DO NOT EDIT */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const rxjs_1 = require("rxjs");
const pdfUtil_1 = require("./util/pdfUtil");
const nodemailer = require("nodemailer");
const esnr_1 = require("./util/esnr");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const ses = new AWS.SES();
let transporter = nodemailer.createTransport({
    SES: ses
});
const billinfo = {
    'billingDate': '2020-09-30T23:59:59.999Z',
    'complete': false,
    'customer': {
        'address': 'Trottackerstrasse 35',
        'bills': [],
        'city': 'Mellingen',
        'email': 'gg@gg.com',
        'firstName': 'Kathi',
        'isHidden': true,
        'lastName': 'Rofka',
        'locations': [],
        'zipcode': '5507'
    },
    'detail': [],
    'discount': 0,
    'distinctTotal': 0,
    'finalizedPrice': 0,
    'from': '2020-09-01T00:00:00.000Z',
    'locations': [],
    'paidAt': '',
    'partnerId': 'gg@gg.com',
    'price': 0,
    'reference': '0000009204',
    'to': '2020-09-30T23:59:59.999Z',
    'total': 0
};
const sendBillAsEmail = (bill, converted, subscriber) => {
    console.log('send mail ');
    transporter.sendMail({
        from: 'noreply@entry-check.ch',
        to: 'gastro.verify@gmail.com',
        subject: process.env.ENV === 'dev' ? 'DEVD EDV DEV' : 'Prod: Rechnung',
        text: 'here is your pdf' + converted.email + ' ',
        attachments: [
            {
                filename: 'rechnung.pdf',
                content: bill
            }
        ]
    }, (err, info) => {
        if (err) {
            console.log(err);
            subscriber.error(err);
        }
        else {
            subscriber.next(info);
            subscriber.complete();
        }
    });
};
const _testHandlde = (record) => {
    return new rxjs_1.Observable(subscriber => {
        const { doc, buffers } = pdfUtil_1.createBillPDF(record, record.detail);
        doc.on('end', () => {
            console.log('hey');
            let pdfData = Buffer.concat(buffers);
            sendBillAsEmail(pdfData, record, subscriber);
        });
    });
};
const handleDynamoRecord = (record) => {
    return new rxjs_1.Observable(subscriber => {
        switch (record.eventName) {
            case 'INSERT': {
                console.log('creating email...');
                const converted = AWS.DynamoDB.Converter.unmarshall((record.dynamodb.NewImage));
                console.log(converted);
                console.log(converted.reference);
                console.log(esnr_1.calcESNR(converted.reference));
                const { doc, buffers } = pdfUtil_1.createBillPDF(converted, converted.detail);
                doc.on('end', () => {
                    console.log('hey');
                    let pdfData = Buffer.concat(buffers);
                    sendBillAsEmail(pdfData, converted, subscriber);
                });
                break;
            }
            case 'DELETE': {
                console.log('delete');
                subscriber.complete();
                break;
            }
            case 'MODIFY': {
                console.log('modify');
                subscriber.complete();
                break;
            }
        }
    });
};
exports.handler = (event) => {
    rxjs_1.forkJoin([...event.Records.map(record => handleDynamoRecord(record))])
        .subscribe(success => {
        console.log('success');
        return {
            statusCode: 200,
            body: 'success',
        };
    }, error => {
        console.log(error);
        return {
            statusCode: 400,
            body: 'error',
        };
    });
};
_testHandlde(billinfo).subscribe(elem => console.log(elem));
const testMe = () => {
};
