"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeValidationError = void 0;
class CodeValidationError {
    constructor(errorMessage, errorStatus, remaining) {
        this.errorMessage = errorMessage;
        this.errorStatus = errorStatus;
        this.remaining = remaining;
    }
    static create(message, status, remaining = -1) {
        return new CodeValidationError(message, status, remaining);
    }
}
exports.CodeValidationError = CodeValidationError;
