"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = void 0;
const moment = require("moment");
class RequestError {
    constructor(status, message, time, data) {
        this.status = status;
        this.message = message;
        this.time = time;
        this.data = data;
    }
    static create(status, message, data) {
        return new RequestError(status, message, moment().toISOString());
    }
}
exports.RequestError = RequestError;
