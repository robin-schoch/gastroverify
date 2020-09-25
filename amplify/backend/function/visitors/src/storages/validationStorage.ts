import {DbConnection, DynamodbError, isNotDynamodbError} from '../util/dynamoDbDriver';
import * as moment from 'moment';
import {Observable, of, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Validation} from '../domain/validation';
import {ValidationState} from '../domain/validationState';
import {CodeValidationError} from '../domain/codeValidationError';
import * as crypto from 'crypto';

import {generateJWT$} from '../util/jwtUtil';

const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'validationStorage', src: true});


export class validationStorage {
  private readonly dbConnection: DbConnection<Validation>;
  private readonly sendSMSCoolDown = 1; // min
  private readonly registerCoolDown = 10; // min

  constructor() {

    this.dbConnection = new DbConnection<Validation>(
        'Validation',
        'phoneNumberHash'
    );
  }

  public validateValidationRequest(phoneNumber: string): Observable<[boolean, ValidationState]> {
    return this.dbConnection.findById(
        crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'))
               .pipe(
                   switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)),
                   map((validation) => {
                     if (!validation) return [true, null];
                     const now = moment();
                     let durationRequested = moment.duration(now.diff(moment(validation.validation_requested)));
                     let durationSucceeded = moment.duration(now.diff(moment(validation.validation_success)));
                     if ((validation.validation_success === '' && durationRequested.asMinutes() > this.sendSMSCoolDown)
                         || (durationSucceeded.asMinutes() > this.registerCoolDown)) {
                       return [true, null];
                     } else {
                       return [
                         false, !validation.validation_success
                                ?
                             // @ts-ignore
                                new ValidationState(moment.duration(this.sendSMSCoolDown, 'minutes').subtract(durationRequested).format('hh:mm:ss'), 'cool down',403 )
                                :
                             // @ts-ignore
                                new ValidationState(moment.duration(this.registerCoolDown, 'minutes').subtract(durationSucceeded).format('hh:mm:ss'), 'already registered', 403)
                       ];
                     }
                   })
               );
  }

  public createValidation(phoneNumber: string, randomNumber: number): Observable<Partial<Validation> | DynamodbError<Validation>> {
    return this.dbConnection.putItem(Validation.generateValidation(phoneNumber, randomNumber));
  }

  public validateCode(phoneNumber: string, code: number): Observable<any> {
    return this.dbConnection.findById(
        crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'))
               .pipe(
                   switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)),
                   switchMap(a => !!a ? of(a) : throwError(CodeValidationError.create('no validation request', 404))),
                   switchMap(a => a.try > 0 ? of(a) : throwError(CodeValidationError.create('you are blocked', 403))),
                   switchMap(a => (Number(code) === a.code) ?
                                  this.dbConnection.putItem(Validation.rightCode(a)) :
                                  this.dbConnection.putItem(Validation.wrongCode(a))),
                   switchMap((a) => isNotDynamodbError(a) ? (a.validation_success !== '' ?
                                                             generateJWT$(phoneNumber, a.validation_success) :
                                                             throwError((CodeValidationError.create('invalid code', 401, a.try)))) :
                                    throwError(a))
               );
  }


  public validateSuccess(decode: any): Observable<boolean> {
    return this.dbConnection.findById(crypto.createHash('sha256').update(String(decode.phone), 'utf8')
                                            .digest('hex')).pipe(
        switchMap(a => isNotDynamodbError(a) ?
                       of(!!a && moment(a.validation_success).diff(decode.validation) === 0) :
                       throwError(a))
    );
  }
}



