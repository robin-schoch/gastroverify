import {generateHr, toCHF} from './overviewPage';
import * as moment from 'moment';

export const generateDetailPage = (doc, location) => {
  generateDetailDetail(doc, location);
  generateDetailTable(doc, location.detail);

};

const generateDetailDetail = (doc, location) => {
  doc.fillColor('#444444')
     .fontSize(20)
     .text(location.name, 50, 120);
  generateHr(doc, 145);

};

const generateDetailTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 170;
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop, 'Datum', 'Einamlige Eintritte', 'Kosten');
  generateHr(doc, invoiceTableTop + 9);
  doc.font('Helvetica');
  invoice = invoice.reverse();
  for (i = 0; i < invoice.length; i++) {
    const item = invoice[i];
    const position = invoiceTableTop + (i + 1) * 15;
    generateTableRow(doc, position, moment(item.reportDate).locale('de').format('L'), item.distinctTotal, toCHF(item.price));
    generateHr(doc, position + 9);
  }
  doc.font('Helvetica-Bold');
  generateTableRow(doc, invoiceTableTop + (invoice.length + 1) * 15, 'Total',
      invoice.map(elem => elem.distinctTotal).reduce((acc, v) => acc + v, 0),
      toCHF(invoice.map(elem => elem.price).reduce((acc, v) => acc + v, 0)));
  doc.font('Helvetica');
};

export const generateTableRow = (doc, y, location, distinctEntries, price,) => {
  doc.fontSize(9)
     .text(location, 50, y)
     .text(distinctEntries, 200, y)
     .text(price, 450, y, {width: 90, align: 'right'});
};
