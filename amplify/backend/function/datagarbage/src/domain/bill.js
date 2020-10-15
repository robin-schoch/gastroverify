"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billBuilder = exports.Bill = void 0;
class Bill {
    constructor(billNumber, partnerId, from, to, complete, paidAt, total, distinctTotal, price, finalizedPrice, customer, locations, detail, discount) {
        this.reference = billNumber;
        this.partnerId = partnerId;
        this.billingDate = to;
        this.from = from;
        this.to = to;
        this.complete = complete;
        this.paidAt = paidAt;
        this.total = total;
        this.distinctTotal = distinctTotal;
        this.price = price;
        this.finalizedPrice = finalizedPrice;
        this.customer = customer;
        this.locations = locations;
        this.detail = detail;
        this.discount = discount;
    }
}
exports.Bill = Bill;
exports.billBuilder = (billNumber, from, to, billInfo, customer, reports, discount = 0) => {
    return new Bill(billNumber, customer.email, from, to, false, '', billInfo.total, billInfo.distinctTotal, billInfo.price, billInfo.finalPrice, customer, reports.map((report) => report.res), reports.map((reports) => Object.assign({}, reports.res, {
        detail: reports.original.map(det => {
            return {
                reportDate: det.reportDate,
                distinctTotal: det.distinctTotal,
                price: det.distinctTotal * det.pricePerEntry
            };
        })
    })), discount);
};
