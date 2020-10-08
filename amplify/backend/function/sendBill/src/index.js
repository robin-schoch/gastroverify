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
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
const ses = new AWS.SES();
let transporter = nodemailer.createTransport({
    SES: ses
});
/*
 const schemaBill: Schema = {
 id: {type: 'String', keyType: 'HASH'},
 date_time: {type: 'Date', keyType: 'RANGE'},
 some_property: {type: 'String'},
 another_property: {type: 'String'},
 reference: {type: 'String'},
 billingDate: {type: 'String'},
 total: {type: 'Number'},
 price: {type: 'Number'},
 distinctTotal: {type: 'Number'},
 paidAt: {type: 'String'},
 from: {type: 'String'},
 locations: {
 type: 'List',
 memberType: {
 type: 'Map', memberType: {type: 'Any'}
 }
 },
 detail: {L: []},
 partnerId: {type: 'String'},
 to: {type: 'String'},
 complete: {type: 'Boolean'},
 customer: {
 M: {
 zipcode: [Object],
 lastName: [Object],
 firstName: [Object],
 address: [Object],
 city: [Object],
 bills: [Object],
 locations: [Object],
 email: [Object],
 isHidden: [Object]
 }
 };
 };
 */
const sendBillAsEmail = (bill, subscriber) => {
    transporter.sendMail({
        from: 'noReply@entry-check.ch',
        to: 'gastro.verify@gmail.com',
        subject: 'PDF Test',
        text: 'here is your pdf',
        attachments: [
            {
                filename: 'rechnung.pdf',
                content: bill
            }
        ]
    }, (err, info) => {
        if (err) {
            subscriber.error(err);
        }
        else {
            subscriber.next(info);
            subscriber.complete();
        }
    });
    /*const params = {
     Destination: {
     ToAddresses: ['gastro.verify@gmail.com']
     },
     Message: {
     Body: {
     Text: {
     Data: 'Test'
  
     }
  
     },
  
     Subject: {
     Data: 'Test Email'
  
     },
     attachments: [{
     filename: 'attachment.pdf',
     content: bill
     }]
     },
     Source: 'noReply@entry-check.ch'
     };
     ses.sendEmail(params, (err, data) => {
     if (err) {
     subscriber.error(err);
     } else {
     subscriber.next(data);
     subscriber.complete();
     }
  
  
     });*/
};
const handleDynamoRecord = (record) => {
    return new rxjs_1.Observable(subscriber => {
        switch (record.eventName) {
            case 'INSERT': {
                console.log(record.dynamodb.NewImage);
                const converted = AWS.DynamoDB.Converter.unmarshall((record.dynamodb.NewImage));
                console.log(converted);
                const { doc, buffers } = pdfUtil_1.createBillPDF(converted, converted.detail);
                doc.on('end', () => {
                    let pdfData = Buffer.concat(buffers);
                    // console.log(pdfData.toString('utf-8'));
                    sendBillAsEmail(pdfData, subscriber);
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
    console.log('i am called');
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
    /*
  
  
     .toPromise()
     .then(elem => {
     console.log('success');
     return {
     statusCode: 200,
     body: 'success',
     };
     }).catch(err => {
     console.log(err);
     return {
     statusCode: 400,
     body: 'error',
     };
  
     });
  
     */
};
