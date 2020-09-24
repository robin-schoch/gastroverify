"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const moment = require("moment");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const validation_1 = require("../domain/validation");
const validationState_1 = require("../domain/validationState");
const codeValidationError_1 = require("../domain/codeValidationError");
const crypto = require("crypto");
const jwtUtil_1 = require("../util/jwtUtil");
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'validationStorage', src: true });
class validationStorage {
    constructor() {
        this.sendSMSCoolDown = 1; // min
        this.registerCoolDown = 10; // min
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Validation', 'phoneNumberHash');
    }
    validateValidationRequest(phoneNumber) {
        return this.dbConnection.findById(crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'))
            .pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a)), operators_1.map((validation) => {
            if (!validation)
                return [true, null];
            const now = moment();
            let durationRequested = moment.duration(now.diff(moment(validation.validation_requested)));
            let durationSucceeded = moment.duration(now.diff(moment(validation.validation_success)));
            if ((validation.validation_success === '' && durationRequested.asMinutes() > this.sendSMSCoolDown)
                || (durationSucceeded.asMinutes() > this.registerCoolDown)) {
                return [true, null];
            }
            else {
                return [
                    false, !validation.validation_success
                        ?
                            // @ts-ignore
                            new validationState_1.ValidationState(moment.duration(this.sendSMSCoolDown, 'minutes').subtract(durationRequested).format('hh:mm:ss'), 'cool down', 403)
                        :
                            // @ts-ignore
                            new validationState_1.ValidationState(moment.duration(this.registerCoolDown, 'minutes').subtract(durationSucceeded).format('hh:mm:ss'), 'already registered', 403)
                ];
            }
        }));
    }
    createValidation(phoneNumber, randomNumber) {
        return this.dbConnection.putItem(validation_1.Validation.generateValidation(phoneNumber, randomNumber));
    }
    validateCode(phoneNumber, code) {
        return this.dbConnection.findById(crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'))
            .pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ? rxjs_1.of(a) : rxjs_1.throwError(a)), operators_1.switchMap(a => !!a ? rxjs_1.of(a) : rxjs_1.throwError(codeValidationError_1.CodeValidationError.create('no validation request', 404))), operators_1.switchMap(a => a.try > 0 ? rxjs_1.of(a) : rxjs_1.throwError(codeValidationError_1.CodeValidationError.create('you are blocked', 403))), operators_1.switchMap(a => (Number(code) === a.code) ?
            this.dbConnection.putItem(validation_1.Validation.rightCode(a)) :
            this.dbConnection.putItem(validation_1.Validation.wrongCode(a))), operators_1.switchMap((a) => dynamoDbDriver_1.isNotDynamodbError(a) ? (a.validation_success !== '' ?
            jwtUtil_1.generateJWT$(phoneNumber, a.validation_success) :
            rxjs_1.throwError((codeValidationError_1.CodeValidationError.create('invalid code', 401, a.try)))) :
            rxjs_1.throwError(a)));
    }
    validateSuccess(decode) {
        return this.dbConnection.findById(crypto.createHash('sha256').update(String(decode.phone), 'utf8')
            .digest('hex')).pipe(operators_1.switchMap(a => dynamoDbDriver_1.isNotDynamodbError(a) ?
            rxjs_1.of(!!a && moment(a.validation_success).diff(decode.validation) === 0) :
            rxjs_1.throwError(a)));
    }
}
exports.validationStorage = validationStorage;
