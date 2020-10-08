import * as moment from 'moment';

export const generateHeader = (doc) => {
  doc.image('logo.png', 50, 45, {width: 50})
     .fillColor('#444444')
     .fontSize(20)
     .text('Entry Check', 120, 57)
     .fontSize(10)
     .text('Robin Schoch', 200, 50, {align: 'right'})
     .text('Breitacker 6b', 200, 65, {align: 'right'})
     .text('5210 Windisch', 200, 80, {align: 'right'})
     .moveDown();
};


export const toCHF = (value) => {
  try {
    return 'CHF ' + value.toFixed(2);
  } catch (e) {
    return 'CHF';
  }

};

export const generateCustomerInformation = (doc, customer) => {
  doc.fillColor('#444444')
     .fontSize(20)
     .text('Rechnung', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc.fontSize(10)
     .text('Rechnungsnummer:', 50, customerInformationTop)
     .font('Helvetica-Bold')
     .text(customer.reference, 150, customerInformationTop)
     .font('Helvetica')
     .text('Rechnungsdatum:', 50, customerInformationTop + 15)
     .text(moment(customer.billingDate).locale('de').format('L'), 150, customerInformationTop + 15)
     .text('Offener Betrag:', 50, customerInformationTop + 30)
     .text(toCHF(customer.price), 150, customerInformationTop + 30)
     .font('Helvetica-Bold')
     .text(customer.customer.firstName + ' ' + customer.customer.lastName, 300, customerInformationTop)
     .font('Helvetica')
     .text(customer.customer.address, 300, customerInformationTop + 15)
     .text(customer.customer.zipcode + ' ' + customer.customer.city, 300, customerInformationTop + 30)
     .moveDown();
  generateHr(doc, 252);
};

export const generateHr = (doc, y) => {
  doc.strokeColor('#aaaaaa')
     .lineWidth(1)
     .moveTo(50, y)
     .lineTo(550, y)
     .stroke();
};

export const generateTableRow = (doc, y, location, distinctEntries, price) => {
  doc.fontSize(10)
     .text(location, 50, y)
     .text(distinctEntries, 200, y)
     .text(price, 450, y, {width: 90, align: 'right'});
};

export const generateInvoiceTable = (doc, invoice) => {
  let i;
  let pageCounter = 0;
  let invoiceTableTop = 330;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop, 'Standort', 'Einamlige Eintritte', 'Kosten');
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');
  for (i = 0; i < invoice.length; i++) {
    const item = invoice[i];

    if (invoiceTableTop + (pageCounter + 1) * 30 > 710) {
      doc.addPage();
      generateHeader(doc);
      invoiceTableTop = 100;
      pageCounter = 0;
    }
    const position = invoiceTableTop + (pageCounter + 1) * 30;
    generateTableRow(doc, position, item.name, item.distinctTotal, toCHF(item.price));
    generateHr(doc, position + 20);
    pageCounter++;
  }
  if (invoiceTableTop + (pageCounter + 1) * 30 > 600) {
    doc.addPage();
    generateHeader(doc);
    invoiceTableTop = 100;
    pageCounter = 0;
  }
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop + (pageCounter + 1) * 30, 'Summe',
      invoice.map(elem => elem.distinctTotal).reduce((acc, v) => acc + v, 0),
      toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
  doc.font('Helvetica');
  generateTableRow(doc, invoiceTableTop + (pageCounter + 2) * 30, 'Mehrwertsteuer 0.0%',
      '',
      toCHF(0));
  generateHr(doc, invoiceTableTop + (pageCounter + 2) * 30 + 20);
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop + (pageCounter + 3) * 30, 'Gesammtbetrag', '',
      toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
  doc.font('Helvetica');
  return invoiceTableTop + (pageCounter + 3) * 30;
};

//Zu begleichen innert 30 Tagen auf folgendes Konto:;;

export const generateFooter = (doc, customer) => {
  doc.font('Helvetica-Bold');
  doc.fontSize(10)
     .text('Zu begleichen innert 30 Tagen auf folgendes Konto:', 50, 650, {width: 500})
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
