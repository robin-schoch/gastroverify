"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billBuilder = exports.Bill = void 0;
const moment = require("moment");
const crypto = require("crypto");
class Bill {
    constructor(partnerId, from, to, complete, paidAt, total, distinctTotal, price, customer, locations, detail) {
        this.reference = crypto.createHash('sha1').update(moment(to).toISOString() + partnerId).digest('hex').substring(0, 10);
        this.partnerId = partnerId;
        this.billingDate = to;
        this.from = from;
        this.to = to;
        this.complete = complete;
        this.paidAt = paidAt;
        this.total = total;
        this.distinctTotal = distinctTotal;
        this.price = price;
        this.customer = customer;
        this.locations = locations;
        this.detail = detail;
    }
}
exports.Bill = Bill;
exports.billBuilder = (partnerId, from, to, total, distinct, price, customer, locations, detail) => {
    return new Bill(partnerId, from, to, false, '', total, distinct, price, customer, locations, detail);
};
