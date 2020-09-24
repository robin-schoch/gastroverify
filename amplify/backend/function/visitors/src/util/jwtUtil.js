"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT$ = exports.verifyJWT = exports.generateJWT = exports.generateJWT$ = void 0;
const rxjs_1 = require("rxjs");
const checkInError_1 = require("../domain/checkInError");
const jwt = require('jsonwebtoken');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'jwtUtil', src: true });
const AWS = require('aws-sdk'), region = 'eu-central-1', secretName = 'JWT_SECRET';
let secret;
var client = new AWS.SecretsManager({
    region: region
});
let env = 'dev';
if (process.env.ENV && process.env.ENV !== 'NONE') {
    env = process.env.ENV;
}
const loadSecret = () => {
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: secretName }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(resolve(JSON.parse(data.SecretString)[env]));
            }
        });
    });
};
const getSecret = async () => {
    if (!secret) {
        log.info('loading secreted');
        secret = await loadSecret();
    }
    return secret;
};
getSecret().then(elem => log.info('loading secrets from secretmanager'));
exports.generateJWT$ = (phoneNumber, momentum) => {
    return new rxjs_1.Observable(subscriber => {
        getSecret().then(sec => {
            subscriber.next(jwt.sign({
                phone: phoneNumber,
                validation: momentum
            }, sec, { expiresIn: '3650d' }));
            subscriber.complete();
        }).catch(err => subscriber.error(err));
    });
};
exports.generateJWT = (phoneNumber, momentum) => {
    getSecret().then(sec => {
        return jwt.sign({
            phone: phoneNumber,
            validation: momentum
        }, sec, { expiresIn: '3650d' });
    });
};
exports.verifyJWT = async (token) => {
    const sec = await getSecret();
    return new Promise(((resolve, reject) => {
        jwt.verify(token, sec, (err, decoded) => {
            if (err)
                reject(err);
            resolve(decoded);
        });
    }));
};
exports.verifyJWT$ = (token) => {
    return new rxjs_1.Observable(subscriber => {
        getSecret().then(sec => {
            jwt.verify(token, sec, (err, decoded) => {
                if (err)
                    subscriber.error(checkInError_1.CheckInError.create(402, 'token is invalid'));
                subscriber.next(decoded);
                subscriber.complete();
            });
        }).catch(err => subscriber.error(checkInError_1.CheckInError.create(402, 'token is invalid')));
    });
};
