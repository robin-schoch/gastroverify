import {Observable} from 'rxjs';
import {CheckInError} from '../domain/checkInError';

const jwt = require('jsonwebtoken');


const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'jwtUtil', src: true});

const AWS = require('aws-sdk'),
    region = 'eu-central-1',
    secretName = 'JWT_SECRET';

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
    client.getSecretValue(
        {SecretId: secretName},
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(resolve(JSON.parse(data.SecretString)[env]));
          }
        }
    );
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

export const generateJWT$ = (phoneNumber, momentum): Observable<any> => {
  return new Observable<any>(subscriber => {
    getSecret().then(sec => {
      subscriber.next(jwt.sign(
          {
            phone: phoneNumber,
            validation: momentum
          },
          sec,
          {expiresIn: '3650d'}
      ));
      subscriber.complete();
    }).catch(err => subscriber.error(err));
  });
};

export const generateJWT = (phoneNumber, momentum) => {
  getSecret().then(sec => {
    return jwt.sign(
        {
          phone: phoneNumber,
          validation: momentum
        },
        sec,
        {expiresIn: '3650d'}
    );

  });
};


export const verifyJWT = async (token) => {
  const sec = await getSecret();
  return new Promise(((resolve, reject) => {
    jwt.verify(
        token,
        sec,
        (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        }
    );
  }));
};

export const verifyJWT$ = (token): Observable<any> => {
  return new Observable<any>(subscriber => {
    getSecret().then(sec => {
      jwt.verify(
          token,
          sec,
          (err, decoded) => {
            if (err) subscriber.error(CheckInError.create(402, 'token is invalid'));
            subscriber.next(decoded);
            subscriber.complete();
          }
      );
    }).catch(err => subscriber.error(CheckInError.create(402, 'token is invalid')));
  });
};
