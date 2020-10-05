"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInError = void 0;
class CheckInError {
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
    static create(status, error) {
        return new CheckInError(status, error);
    }
}
exports.CheckInError = CheckInError;
