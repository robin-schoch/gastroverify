import {generateHr, toCHF} from './overviewPage';

export const generateDetailPage = (doc, location) => {
  generateDetailDetail(doc, location);
  generateDetailTable(doc, location.detail);

};

const generateDetailDetail = (doc, location) => {
  doc.fillColor('#444444')
     .fontSize(20)
     .text(location.locationName, 50, 120);
  generateHr(doc, 145);

};

const generateDetailTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 170;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop, 'Datum', 'Einamlige Eintritte', 'Kosten');
  generateHr(doc, invoiceTableTop + 9);
  doc.font('Helvetica');
  for (i = 0; i < invoice.length; i++) {
    const item = invoice[i];
    const position = invoiceTableTop + (i + 1) * 15;
    generateTableRow(doc, position, item.date.locale('de').format('L'), item.distinctEntries, toCHF(item.price));
    generateHr(doc, position + 9);
  }
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop + (invoice.length + 1) * 15, 'Total',
      invoice.map(elem => elem.distinctEntries).reduce((acc, v) => acc + v),
      toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v)));
  doc.font('Helvetica');
};

export const generateTableRow = (doc, y, location, distinctEntries, price,) => {
  doc.fontSize(9)
     .text(location, 50, y)
     .text(distinctEntries, 200, y)
     .text(price, 450, y, {width: 90, align: 'right'});
};
