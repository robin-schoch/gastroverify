"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billBuilder = exports.Bill = void 0;
class Bill {
    constructor(partnerId, from, to, complete, paidAt, total, distinctTotal, price) {
        this.partnerId = partnerId;
        this.billingDate = to;
        this.from = from;
        this.to = to;
        this.complete = complete;
        this.paidAt = paidAt;
        this.total = total;
        this.distinctTotal = distinctTotal;
        this.price = price;
    }
}
exports.Bill = Bill;
exports.billBuilder = (partnerId, from, to, total, distinct, price) => {
    return new Bill(partnerId, from, to, false, '', total, distinct, price);
};
