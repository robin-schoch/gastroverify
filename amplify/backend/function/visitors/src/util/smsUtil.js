"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifactionSMS = exports.sendVerificationSMS = void 0;
const rxjs_1 = require("rxjs");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'eu-central-1' });
const SNS = new AWS.SNS();
const defaultSMSText = 'Dein Verifikationcode ist:';
const defaultSenderId = 'EntryCheck';
exports.sendVerificationSMS = (phoneNumber, qrCode, code) => {
    const smsParam = {
        PhoneNumber: phoneNumber,
        Message: `${!!(qrCode === null || qrCode === void 0 ? void 0 : qrCode.smsText) ? qrCode.smsText : defaultSMSText} ${code}`,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                DataType: 'String',
                StringValue: !!(qrCode === null || qrCode === void 0 ? void 0 : qrCode.senderID) ? qrCode.senderID : defaultSenderId
            }
        },
    };
    return new rxjs_1.Observable(subscriber => {
        SNS.publish(smsParam, (err, data) => {
            if (err)
                subscriber.error(err);
            subscriber.next(data);
            subscriber.complete();
        });
    });
};
exports.sendVerifactionSMS = (phoneNumber, code, senderId = 'EntryCheck', text = 'Dein Verifikationcode ist:', language = 'de') => {
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
        SNS.publish(params, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    }));
};
