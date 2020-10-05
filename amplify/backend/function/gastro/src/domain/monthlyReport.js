"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyReport = void 0;
class MonthlyReport {
    constructor(billingDate, complete, paidAt, partnerId, price, from, to, distinctTotal, total) {
        this.billingDate = billingDate;
        this.complete = complete;
        this.paidAt = paidAt;
        this.partnerId = partnerId;
        this.price = price;
        this.from = from;
        this.to = to;
        this.distinctTotal = distinctTotal;
        this.total = total;
    }
}
exports.MonthlyReport = MonthlyReport;
