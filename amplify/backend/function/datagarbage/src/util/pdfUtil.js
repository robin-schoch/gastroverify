"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBillPDF = void 0;
const overviewPage_1 = require("./overviewPage");
const moment = require("moment");
const detailPages_1 = require("./detailPages");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const overview = {
    reference: 'asdfijaiosdf',
    billingDate: moment().toISOString(),
    partnerId: 'sadf@dsf',
    complete: false,
    from: moment().toISOString(),
    to: moment().toISOString(),
    paidAt: null,
    total: 34,
    distinctTotal: 135,
    price: 81,
    customer: {
        firstName: 'Marc',
        lastName: 'Lusser',
        address: 'hohenweg 3',
        city: 'Baden',
        zipcode: 5400
    },
    locations: [
        {
            name: 'Billabong',
            distinctTotal: 123,
            price: 80
        },
        {
            location: 'Time bar',
            distinctTotal: 123,
            price: 80
        }
    ]
};
const detail = [
    {
        locationName: 'Time bar',
        distinctTotal: 123,
        price: 80,
        detail: [
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 12,
                price: 12
            }
        ]
    },
    {
        locationName: 'Billabong',
        distinctTotal: 12,
        price: 1,
        detail: [
            {
                reportDate: moment().toISOString(),
                distinctTotal: 2,
                price: 2
            },
            {
                reportDate: moment().toISOString(),
                distinctTotal: 2,
                price: 2
            }
        ]
    }
];
exports.createBillPDF = (overview, pages) => {
    // Create a document
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream('./pdf/' + overview.reference + '.pdf'));
    let buffers = [];
    /*
     doc.on('data', buffers.push.bind(buffers));
     doc.on('end', () => {
  
     let pdfData = Buffer.concat(buffers);
     console.log(pdfData.toString('utf-8'));
  
     // ... now send pdfData as attachment ...
  
     });*/
    overviewPage(doc, overview);
    pages.forEach(p => detailPages(doc, p));
    doc.end();
};
const overviewPage = (doc, overview) => {
    overviewPage_1.generateHeader(doc);
    overviewPage_1.generateCustomerInformation(doc, overview);
    let pos = overviewPage_1.generateInvoiceTable(doc, overview.locations);
    if (pos > 640) {
        doc.addPage();
        overviewPage_1.generateHeader(doc);
    }
    overviewPage_1.generateFooter(doc, overview);
};
const detailPages = (doc, detail) => {
    doc.addPage();
    overviewPage_1.generateHeader(doc);
    detailPages_1.generateDetailPage(doc, detail);
};
// createBillPDF(overview, detail);
