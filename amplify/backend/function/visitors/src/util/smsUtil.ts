import {QrCodeMapping} from '../domain/qrCodeMapping';
import {Observable} from 'rxjs';
import {PublishResponse} from 'aws-sdk/clients/sns';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION || 'eu-central-1'});
const SNS = new AWS.SNS();

const defaultSMSText = 'Dein Verifikationcode ist:';
const defaultSenderId = 'EntryCheck';

export const sendVerificationSMS = (phoneNumber: string, qrCode: QrCodeMapping, code: number): Observable<PublishResponse> => {
  const smsParam = {
    PhoneNumber: phoneNumber,
    Message: `${!!qrCode?.smsText ? qrCode.smsText : defaultSMSText} ${code}`,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: !!qrCode?.senderID ? qrCode.senderID : defaultSenderId
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

export const sendVerifactionSMS = (
    phoneNumber,
    code,
    senderId = 'EntryCheck',
    text = 'Dein Verifikationcode ist:',
    language = 'de'
) => {
  const params = {
    PhoneNumber: phoneNumber,
    Message: `${text} ${code}`,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: senderId
      }
    },
  };
  return new Promise(((resolve, reject) => {
        SNS.publish(
            params,
            (err, data) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                resolve(data);
              }
            }
        );
      })
  );
};
