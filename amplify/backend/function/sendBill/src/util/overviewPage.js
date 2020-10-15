"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFooter = exports.generateInvoiceTable = exports.generateTableRow = exports.generateHr = exports.generateCustomerInformation = exports.toCHF = exports.generateHeader = void 0;
const moment = require("moment");
exports.generateHeader = (doc) => {
    const logoBackground = 'M 18.035156 0.707031 C 13.015625 1.207031 8.328125 3.722656 5.015625 7.707031 C -0.378906 14.207031 -0.84375 23.601562 3.863281 30.671875 C 9.328125 38.898438 19.949219 41.707031 28.707031 37.277344 C 35.308594 33.949219 39.34375 27.363281 39.34375 20 C 39.34375 14.707031 37.328125 9.878906 33.585938 6.171875 C 29.484375 2.15625 23.792969 0.136719 18.035156 0.707031 Z M 24.398438 3.601562 C 29.984375 5.101562 34.570312 9.601562 36.328125 15.277344 C 36.757812 16.707031 36.792969 17 36.792969 20 C 36.792969 22.984375 36.757812 23.292969 36.328125 24.707031 C 35.449219 27.550781 34 29.964844 31.984375 31.984375 C 29.964844 34 27.550781 35.449219 24.707031 36.328125 C 23.292969 36.757812 22.984375 36.792969 20 36.792969 C 17 36.792969 16.707031 36.757812 15.277344 36.328125 C 10.65625 34.898438 6.914062 31.742188 4.808594 27.5 C 3.464844 24.777344 3.207031 23.585938 3.191406 20 C 3.191406 16.449219 3.429688 15.328125 4.828125 12.5 C 7.171875 7.757812 11.863281 4.171875 16.929688 3.292969 C 18.570312 3 22.828125 3.171875 24.398438 3.601562 Z M 24.398438 3.601562';
    const logoCross = 'M 28.898438 12.449219 C 28.378906 12.949219 25.121094 16.328125 21.636719 19.949219 C 18.15625 23.585938 15.257812 26.550781 15.207031 26.550781 C 15.136719 26.550781 13.742188 24.964844 12.101562 23.015625 C 9.292969 19.691406 9.085938 19.484375 8.535156 19.484375 C 7.863281 19.484375 7.242188 20.015625 7.242188 20.601562 C 7.242188 20.808594 7.5 21.277344 7.808594 21.65625 C 11.085938 25.570312 14.242188 29.257812 14.449219 29.429688 C 15.207031 30.050781 15.464844 29.84375 20.035156 25.121094 C 29.101562 15.757812 31.292969 13.429688 31.449219 13.015625 C 31.691406 12.414062 31.101562 11.65625 30.363281 11.585938 C 29.898438 11.535156 29.671875 11.671875 28.898438 12.449219 Z M 28.898438 12.449219 ';
    doc.addPath(logoCross, doc.mmToPoints(20), doc.mmToPoints(14))
        .fillColor('#000000')
        .fill();
    doc.addPath(logoBackground, doc.mmToPoints(20), doc.mmToPoints(14))
        .fillColor('#000000')
        .fill();
    doc
        //.image('logo.png', 50, 45, {width: 50})
        .fillColor('#444444')
        .fontSize(20)
        .text('Entry Check', 120, 57)
        .fontSize(10)
        .text('Robin Schoch', 480, 50)
        .text('Breitacker 6b', 480, 65)
        .text('5210 Windisch', 480, 80)
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
exports.generateInvoiceTable = (doc, meta) => {
    const invoice = meta.locations;
    let i;
    let pageCounter = 0;
    let invoiceTableTop = 330;
    let endPageCounter = 1;
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
    if (invoiceTableTop + (pageCounter + endPageCounter) * 30 > 600) {
        doc.addPage();
        exports.generateHeader(doc);
        invoiceTableTop = 100;
        pageCounter = 0;
    }
    doc.font('Helvetica-Bold');
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + endPageCounter) * 30, 'Summe', meta.distinctTotal, exports.toCHF(meta.price));
    doc.font('Helvetica');
    endPageCounter = endPageCounter + 1;
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + endPageCounter) * 30, 'Mehrwertsteuer 0.0%', '', exports.toCHF(0));
    if (meta.discount > 0) {
        endPageCounter = endPageCounter + 1;
        exports.generateTableRow(doc, invoiceTableTop + (pageCounter + endPageCounter) * 30, 'Rabatt', meta.discount + '%', exports.toCHF(meta.finalizedPrice - meta.price));
    }
    exports.generateHr(doc, invoiceTableTop + (pageCounter + endPageCounter) * 30 + 20);
    doc.font('Helvetica-Bold');
    endPageCounter = endPageCounter + 1;
    exports.generateTableRow(doc, invoiceTableTop + (pageCounter + endPageCounter) * 30, 'Gesammtbetrag', '', exports.toCHF(meta.finalizedPrice));
    doc.font('Helvetica');
    return invoiceTableTop + (pageCounter + endPageCounter) * 30;
};
//Zu begleichen innert 30 Tagen auf folgendes Konto:;;
exports.generateFooter = (doc, customer) => {
    doc.font('Helvetica-Bold');
    doc.fontSize(10);
    //.text('Zu begleichen innert 30 Tagen auf folgendes Konto:', 50, 650, {width: 500});
    /*.moveDown()
     .text('Robin Michael Schoch')
     .text('UBS AG')
     .text('5400 Baden')
     .text('CH39 0023 2232 1189 9540 Z')
     .text('Buchungstext: ' + customer.reference);*/
    doc.font('Helvetica');
};
