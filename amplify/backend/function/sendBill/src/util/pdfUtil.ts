import {generateCustomerInformation, generateFooter, generateHeader, generateInvoiceTable} from './overviewPage';
import {generateDetailPage} from './detailPages';
import * as SwissQRBill from 'swissqrbill';
import {data} from 'swissqrbill';
import {calcESNR} from './esnr';
import * as streamBuffers from 'stream-buffers';

const PDFDocument = require('pdfkit');
const fs = require('fs');

const billinfo = {
  "billingDate": "2020-09-30T23:59:59.999Z",
  "complete": false,
  "customer": {
    "address": "Trottackerstrasse 35",
    "bills": [

    ],
    "city": "Mellingen",
    "email": "gg@gg.com",
    "firstName": "Kathi",
    "isHidden": true,
    "lastName": "Rofka",
    "locations": [

    ],
    "zipcode": "5507"
  },
  "detail": [

  ],
  "discount": 0,
  "distinctTotal": 0,
  "finalizedPrice": 0,
  "from": "2020-09-01T00:00:00.000Z",
  "locations": [

  ],
  "paidAt": "",
  "partnerId": "gg@gg.com",
  "price": 0,
  "reference": "0000009204",
  "to": "2020-09-30T23:59:59.999Z",
  "total": 0
}
const QRIBAN = 'CH443000523211899540Z';


export const createBillPDF = (overview, pages) => {
      // Create a document
      const data = <data>{
        currency: 'CHF',
        amount: overview.finalizedPrice,
        reference: calcESNR(overview.reference),
        creditor: {
          name: 'Robin Schoch',
          address: 'Breitacker 6b',
          zip: 5210,
          city: 'Windisch',
          account: QRIBAN,
          country: 'CH'
        },
        debtor: {
          name: overview.customer.firstName + ' ' + overview.customer.lastName,
          address: overview.customer.address,
          zip: Number(overview.customer.zipcode),
          city: overview.customer.city,
          country: 'CH'
        }
      };


      const stream = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024),   // start at 100 kilobytes.
        incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
      });
      console.log(calcESNR(overview.reference))
      const doc = new SwissQRBill.PDF(data, stream, {
        autoGenerate: false,
        size: 'A4'
      });
      // fs.createWriteStream('./' + overview.reference + '.pdf')

      // fs.createWriteStream('./pdf/' + overview.reference + '.pdf')
      //const doc = new PDFDocument({margin: 50});
      //doc.pipe(fs.createWriteStream('./pdf/' + overview.reference + '.pdf'));

      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      /*
       doc.on('end', () => {
       let pdfData = Buffer.concat(buffers);
       console.log(pdfData.toString('utf-8'));
       });

       */
      overviewPage(doc, overview);

      doc.addQRBill();
      pages.forEach(p => detailPages(doc, p));
      doc.end();
      return {doc: doc, buffers: buffers};

    }
;

const overviewPage = (doc, overview) => {
  generateHeader(doc);
  generateCustomerInformation(doc, overview);
  let pos = generateInvoiceTable(doc, overview);
  if (pos > 640) {
    doc.addPage();
    generateHeader(doc);
  }
  generateFooter(doc, overview);
};

const detailPages = (doc, detail) => {
  doc.addPage();
  generateHeader(doc);
  generateDetailPage(doc, detail);
};


// createBillPDF(billinfo, billinfo.detail);

//console.log(calcCheckSum(staticRef + '1010101010'));
