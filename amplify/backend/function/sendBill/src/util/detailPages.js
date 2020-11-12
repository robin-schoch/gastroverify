"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTableRow = exports.generateDetailPage = void 0;
const overviewPage_1 = require("./overviewPage");
const moment = require("moment");
exports.generateDetailPage = (doc, location) => {
    generateDetailDetail(doc, location);
    generateDetailTable(doc, location.detail);
};
const generateDetailDetail = (doc, location) => {
    doc.fillColor('#444444')
        .fontSize(20)
        .text(location.name, 50, 120);
    overviewPage_1.generateHr(doc, 145);
};
const generateDetailTable = (doc, invoice) => {
    let i;
    const invoiceTableTop = 170;
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop, 'Datum', 'Einmalige Eintritte', 'Kosten');
    overviewPage_1.generateHr(doc, invoiceTableTop + 9);
    doc.font('Helvetica');
    invoice = invoice.reverse();
    for (i = 0; i < invoice.length; i++) {
        const item = invoice[i];
        const position = invoiceTableTop + (i + 1) * 15;
        exports.generateTableRow(doc, position, moment(item.reportDate).locale('de').format('L'), item.distinctTotal, overviewPage_1.toCHF(item.price));
        overviewPage_1.generateHr(doc, position + 9);
    }
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop + (invoice.length + 1) * 15, 'Total', invoice.map(elem => elem.distinctTotal).reduce((acc, v) => acc + v, 0), overviewPage_1.toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
    doc.font('Helvetica');
};
exports.generateTableRow = (doc, y, location, distinctEntries, price) => {
    doc.fontSize(9)
        .text(location, 50, y)
        .text(distinctEntries, 200, y)
        .text(price, 450, y, { width: 90, align: 'right' });
};
