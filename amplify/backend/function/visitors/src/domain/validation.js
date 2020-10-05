"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const moment = require("moment");
const crypto = require("crypto");
class Validation {
    constructor(phoneNumberHash, code, strikes, tryy, validation_requested, validation_success) {
        this.phoneNumberHash = phoneNumberHash;
        this.code = code;
        this.strikes = strikes;
        this.try = tryy;
        this.validation_requested = validation_requested;
        this.validation_success = validation_success;
    }
    static generateValidation(phoneNumber, randomNumber) {
        return new Validation(crypto.createHash('sha256').update(String(phoneNumber), 'utf8').digest('hex'), randomNumber, 0, 5, moment().toISOString(), '');
    }
    static wrongCode(a) {
        console.log("wrong");
        return new Validation(a.phoneNumberHash, a.code, a.strikes, a.try - 1, a.validation_requested, a.validation_success);
    }
    static rightCode(a) {
        console.log("right");
        return new Validation(a.phoneNumberHash, a.code, a.strikes, a.try, a.validation_requested, moment().toISOString());
    }
}
exports.Validation = Validation;
