/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_MONTHLYREPORT_ARN
 STORAGE_MONTHLYREPORT_NAME
 Amplify Params - DO NOT EDIT */

import {forkJoin, Observable, Subscriber} from 'rxjs';
import {createBillPDF} from './util/pdfUtil';
import * as nodemailer from 'nodemailer';
import {calcESNR} from './util/esnr';
import {timeout} from 'rxjs/operators';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
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

const sendBillAsEmail = (bill: Buffer, converted: any, subscriber: Subscriber<any>) => {
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
    } else {
      subscriber.next(info);
      subscriber.complete();
    }
  });
};

const _testHandlde = (record: any): Observable<any> => {
  return new Observable<any>(subscriber => {
    const {doc, buffers} = createBillPDF(record, record.detail);
    doc.on('end', () => {
      console.log('hey');
      let pdfData = Buffer.concat(buffers);
      sendBillAsEmail(pdfData, record, subscriber);
    });
  });
};

const handleDynamoRecord = (record: any): Observable<any> => {
  return new Observable<any>(subscriber => {

    console.log(record.eventName);
    switch (record.eventName) {
      case 'INSERT': {
        console.log('creating email...');
        const converted = AWS.DynamoDB.Converter.unmarshall((record.dynamodb.NewImage));
        console.log(converted);
        console.log(converted.reference);
        console.log(calcESNR(converted.reference));
        const {doc, buffers} = createBillPDF(converted, converted.detail);
        doc.on('finish', () => {;
          let pdfData = Buffer.concat(buffers);
          sendBillAsEmail(pdfData, converted, subscriber);
        });
        subscriber.next('done');
        subscriber.complete();
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

export const handler = (event) => {
  forkJoin([...event.Records.map(record => handleDynamoRecord(record))])
      .pipe(timeout(2000))
      .subscribe(
          success => {
            console.log('success');
            return {
              statusCode: 200,
              body: 'success',
            };
          },
          error => {
            console.log('kill it');
            console.log(error);
            return {
              statusCode: 200,
              body: 'error',
            };
          }
      );
};


// _testHandlde(billinfo).subscribe(elem => console.log(elem));

