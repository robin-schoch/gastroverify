import {generateCustomerInformation, generateFooter, generateHeader, generateInvoiceTable} from './overviewPage';
import * as moment from 'moment';
import {generateDetailPage} from './detailPages';

const PDFDocument = require('pdfkit');
const fs = require('fs');

const overview = {
  billId: 'asdfijaiosdf',
  billingDate: moment(),
  customer: {
    firstName: 'Marc',
    lastName: 'Lusser',
    address: 'hohenweg 3',
    city: 'Baden',
    zipcode: 5400

  },
  sumAllEntries: 135,
  sumAllPrice: 81,
  locations: [
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },

    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },

    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },

    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    },
    {
      name: 'Time bar',
      distinctEntries: 123,
      price: 80
    }
  ]
};

const pages = [
  {
    locationName: 'Time bar',
    sumAllEntries: 123,
    sumAllPrice: 80,
    detail: [
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },

      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },

      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      },
      {
        date: moment(),
        distinctEntries: 12,
        price: 12
      }
    ]
  },
  {
    locationName: 'Billabong',
    sumAllEntries: 12,
    sumAllPrice: 1,
    detail: [
      {
        date: moment(),
        distinctEntries: 2,
        price: 2
      },
      {
        date: moment(),
        distinctEntries: 2,
        price: 2
      }
    ]
  }
];

const createBillPDF = (overview, pages) => {
  // Create a document
  const doc = new PDFDocument({margin: 50});


  doc.pipe(fs.createWriteStream('output.pdf'));

  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {

    let pdfData = Buffer.concat(buffers);
    console.log(pdfData.toString('utf-8'));

    // ... now send pdfData as attachment ...

  });


  overviewPage(doc, overview);
  pages.forEach(p => detailPages(doc, p));


  doc.end();

};

const overviewPage = (doc, overview) => {
  generateHeader(doc);
  generateCustomerInformation(doc, overview);
  let pos = generateInvoiceTable(doc, overview.locations);
  if (pos > 640) {
    doc.addPage();
    generateHeader(doc);
  }
  generateFooter(doc);
};

const detailPages = (doc, detail) => {
  doc.addPage();
  generateHeader(doc);
  generateDetailPage(doc, detail);
};


createBillPDF(overview, pages);
