import {generateCustomerInformation, generateFooter, generateHeader, generateInvoiceTable} from './overviewPage';
import {generateDetailPage} from './detailPages';
import * as SwissQRBill from 'swissqrbill';
import {data} from 'swissqrbill';
import {calcESNR} from './esnr';
import * as streamBuffers from 'stream-buffers';

const PDFDocument = require('pdfkit');
const fs = require('fs');

const billinfo = {
  'billingDate': '2020-09-30T23:59:59.999Z',
  'complete': false,
  'customer': {
    'address': 'Höhenweg 57b',
    'bills': [],
    'city': 'Untersiggenthal',
    'email': 'andreas.umbricht@gmail.com',
    'firstName': 'Andreas',
    'isHidden': false,
    'lastName': 'Umbricht',
    'locations': [
      {
        'active': true,
        'checkInCode': '361b8594-2b0b-4406-8b48-9386d178e9b8',
        'checkOutCode': '31e82203-1b96-46f9-b98e-b77f574d6db3',
        'city': 'Untersiggenthal',
        'locationId': 'e817e696-f5b6-4726-9952-8bb2627a0f69',
        'name': 'Test',
        'payment': 'default',
        'street': 'Test 2123',
        'zipcode': '5417'
      }
    ],
    'referral': 0,
    'zipcode': '5417'
  },
  'detail': [
    {
      'detail': [
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-30T08:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-29T08:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-28T08:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-27T08:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-26T06:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-25T06:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-24T06:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-23T04:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-22T04:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-21T04:00:00.000Z'
        },
        {
          'distinctTotal': 0,
          'price': 0,
          'reportDate': '2020-09-20T04:00:00.000Z'
        },
        {
          'distinctTotal': 1,
          'price': 0.15,
          'reportDate': '2020-09-19T04:00:00.000Z'
        }
      ],
      'distinctTotal': 1,
      'location': 'e817e696-f5b6-4726-9952-8bb2627a0f69',
      'name': 'Test',
      'price': 0.15,
      'total': 2
    }
  ],
  'discount': 0,
  'distinctTotal': 1,
  'finalizedPrice': 0.15,
  'from': '2020-09-01T00:00:00.000Z',
  'locations': [
    {
      'distinctTotal': 1,
      'location': 'e817e696-f5b6-4726-9952-8bb2627a0f69',
      'name': 'Test',
      'price': 0.15,
      'total': 2
    }
  ],
  'paidAt': '',
  'partnerId': 'andreas.umbricht@gmail.com',
  'price': 0.15,
  'reference': '0000009205',
  'to': '2020-09-30T23:59:59.999Z',
  'total': 2
};
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


createBillPDF(billinfo, billinfo.detail);

//console.log(calcCheckSum(staticRef + '1010101010'));
