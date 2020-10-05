"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationState = void 0;
class ValidationState {
    constructor(interval, status, reqStatus) {
        this.interval = interval;
        this.status = status;
        this.reqStatus = reqStatus;
    }
}
exports.ValidationState = ValidationState;
