/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_MONTHLYREPORT_ARN
 STORAGE_MONTHLYREPORT_NAME
 Amplify Params - DO NOT EDIT */

import {forkJoin, Observable, Subscriber} from 'rxjs';
import {createBillPDF} from './util/pdfUtil';
import * as nodemailer from 'nodemailer';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const ses = new AWS.SES();

let transporter = nodemailer.createTransport({
  SES: ses
});

const sendBillAsEmail = (bill: Buffer, subscriber: Subscriber<any>) => {
  transporter.sendMail({
    from: 'noreply@entry-check.ch',
    to: 'gastro.verify@gmail.com',
    subject: process.env.ENV === 'dev' ? 'DEVD EDV DEV' : 'Prod: Rechnung',
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
    } else {
      subscriber.next(info);
      subscriber.complete();
    }
  });
};

const handleDynamoRecord = (record: any): Observable<any> => {
  return new Observable<any>(subscriber => {

    switch (record.eventName) {
      case 'INSERT': {
        const converted = AWS.DynamoDB.Converter.unmarshall((record.dynamodb.NewImage));
        const {doc, buffers} = createBillPDF(converted, converted.detail);
        doc.on('end', () => {
          let pdfData = Buffer.concat(buffers);
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

export const handler = (event) => {

  console.log('i am called');
  forkJoin([...event.Records.map(record => handleDynamoRecord(record))])
      .subscribe(
          success => {
            console.log('success');
            return {
              statusCode: 200,
              body: 'success',
            };
          },
          error => {
            console.log(error);
            return {
              statusCode: 400,
              body: 'error',
            };
          }
      );

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
