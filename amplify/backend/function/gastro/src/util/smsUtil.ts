import {QrCodeMapping} from '../domain/qrCodeMapping';
import {Observable} from 'rxjs';
import {PublishResponse} from 'aws-sdk/clients/sns';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION || 'eu-central-1'});
const SNS = new AWS.SNS();

const defaultSenderId = 'EntryCheck';

export const sendCoronaSMS = (phoneNumber: string, message: string): Observable<PublishResponse> => {
  const smsParam = {
    PhoneNumber: phoneNumber,
    Message: message,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: defaultSenderId
      }
    },
  };
  return new Observable(subscriber => {
    SNS.publish(smsParam, (err, data) => {
      if (err) subscriber.error(err);
      subscriber.next(data);
      subscriber.complete();
    });
  });
};
