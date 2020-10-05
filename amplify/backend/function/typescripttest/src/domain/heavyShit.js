"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calc = void 0;
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
exports.calc = () => {
    if (Math.random() > 0.5) {
        return { heavy: true, shit: 'big' };
    }
    else {
        return { weak: true, shit: 'bum' };
    }
};
