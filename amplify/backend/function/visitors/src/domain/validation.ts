import * as moment from 'moment';
import * as crypto from 'crypto';

export class Validation {

  public phoneNumberHash: string;
  public code: number;
  public strikes: number;
  public try: number;
  public validation_requested: string;
  public validation_success: string;

  public static generateValidation(phoneNumber: string, randomNumber: number) {

    return new Validation(
        crypto.createHash('sha256').update(
            String(phoneNumber),
            'utf8'
        ).digest('hex'),
        randomNumber,
        0,
        5,
        moment().toISOString(),
        ''
    );
  }

  static wrongCode(a: Validation) {
    console.log("wrong")
    return new Validation(
        a.phoneNumberHash,
        a.code,
        a.strikes,
        a.try - 1,
        a.validation_requested,
        a.validation_success
    );
  }

  constructor(
      phoneNumberHash: string,
      code: number,
      strikes: number,
      tryy: number,
      validation_requested: string,
      validation_success: string
  ) {
    this.phoneNumberHash = phoneNumberHash;
    this.code = code;
    this.strikes = strikes;
    this.try = tryy;
    this.validation_requested = validation_requested;
    this.validation_success = validation_success;
  }

  static rightCode(a: Validation) {
    console.log("right")
    return new Validation(
        a.phoneNumberHash,
        a.code,
        a.strikes,
        a.try,
        a.validation_requested,
        moment().toISOString(),
    );
  }
}
