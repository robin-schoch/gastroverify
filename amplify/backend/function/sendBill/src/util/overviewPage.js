"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFooter = exports.generateInvoiceTable = exports.generateTableRow = exports.generateHr = exports.generateCustomerInformation = exports.toCHF = exports.generateHeader = void 0;
const moment = require("moment");
exports.generateHeader = (doc) => {
    doc.image('logo.png', 50, 45, { width: 50 })
        .fillColor('#444444')
        .fontSize(20)
        .text('Entry Check', 120, 57)
        .fontSize(10)
        .text('Robin Schoch', 200, 50, { align: 'right' })
        .text('Breitacker 6b', 200, 65, { align: 'right' })
        .text('5210 Windisch', 200, 80, { align: 'right' })
        .moveDown();
};
exports.toCHF = (value) => {
    try {
        return 'CHF ' + value.toFixed(2);
    }
    catch (e) {
        return 'CHF';
    }
};
exports.generateCustomerInformation = (doc, customer) => {
    doc.fillColor('#444444')
        .fontSize(20)
        .text('Rechnung', 50, 160);
    exports.generateHr(doc, 185);
    const customerInformationTop = 200;
    doc.fontSize(10)
        .text('Rechnungsnummer:', 50, customerInformationTop)
        .font('Helvetica-Bold')
        .text(customer.reference, 150, customerInformationTop)
        .font('Helvetica')
        .text('Rechnungsdatum:', 50, customerInformationTop + 15)
        .text(moment(customer.billingDate).locale('de').format('L'), 150, customerInformationTop + 15)
        .text('Offener Betrag:', 50, customerInformationTop + 30)
        .text(exports.toCHF(customer.price), 150, customerInformationTop + 30)
        .font('Helvetica-Bold')
        .text(customer.customer.firstName + ' ' + customer.customer.lastName, 300, customerInformationTop)
        .font('Helvetica')
        .text(customer.customer.address, 300, customerInformationTop + 15)
        .text(customer.customer.zipcode + ' ' + customer.customer.city, 300, customerInformationTop + 30)
        .moveDown();
    exports.generateHr(doc, 252);
};
exports.generateHr = (doc, y) => {
    doc.strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
};
exports.generateTableRow = (doc, y, location, distinctEntries, price) => {
    doc.fontSize(10)
        .text(location, 50, y)
        .text(distinctEntries, 200, y)
        .text(price, 450, y, { width: 90, align: 'right' });
};
exports.generateInvoiceTable = (doc, invoice) => {
    let i;
    let pageCounter = 0;
    let invoiceTableTop = 330;
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop, 'Standort', 'Einamlige Eintritte', 'Kosten');
    exports.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');
    for (i = 0; i < invoice.length; i++) {
        const item = invoice[i];
        if (invoiceTableTop + (pageCounter + 1) * 30 > 710) {
            doc.addPage();
            exports.generateHeader(doc);
            invoiceTableTop = 100;
            pageCounter = 0;
        }
        const position = invoiceTableTop + (pageCounter + 1) * 30;
        exports.generateTableRow(doc, position, item.name, item.distinctTotal, exports.toCHF(item.price));
        exports.generateHr(doc, position + 20);
        pageCounter++;
    }
    if (invoiceTableTop + (pageCounter + 1) * 30 > 600) {
        doc.addPage();
        exports.generateHeader(doc);
        invoiceTableTop = 100;
        pageCounter = 0;
    }
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + 1) * 30, 'Summe', invoice.map(elem => elem.distinctTotal).reduce((acc, v) => acc + v, 0), exports.toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
    doc.font('Helvetica');
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + 2) * 30, 'Mehrwertsteuer 0.0%', '', exports.toCHF(0));
    exports.generateHr(doc, invoiceTableTop + (pageCounter + 2) * 30 + 20);
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + 3) * 30, 'Gesammtbetrag', '', exports.toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
    doc.font('Helvetica');
    return invoiceTableTop + (pageCounter + 3) * 30;
};
//Zu begleichen innert 30 Tagen auf folgendes Konto:;;
exports.generateFooter = (doc, customer) => {
    doc.font('Helvetica-Bold');
    doc.fontSize(10)
        .text('Zu begleichen innert 30 Tagen auf folgendes Konto:', 50, 650, { width: 500 })
        .moveDown()
        .text('Robin Michael Schoch')
        .text('UBS AG')
        .text('5400 Baden')
        .text('CH39 0023 2232 1189 9540 Z')
        .text('Buchungstext: ' + customer.reference);
    doc.font('Helvetica');
    /*
  
  
     Zu begleichen innert 30 Tagen auf folgendes Konto:
     Robin Michael Schoch
     UBS AG
     5400 Baden
     CH39 0023 2232 1189 9540 Z
     */
};
