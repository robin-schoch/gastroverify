const PDFDocument = require('pdfkit');
const fs = require('fs');
import * as moment from 'moment';

const p = {
    city: 'Windisch',
    locations: [
        {
            zipcode: '5210',
            city: 'Windisch',
            locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb',
            street: 'Breitacker 6b',
            name: 'Meine Bar',
            active: true,
            checkOutCode: '759bf0f7-f231-41eb-bee2-9c7e76157d08',
            checkInCode: 'a9e4e78f-5b75-400f-9a0a-aeacdc1b8c07'
        }
    ],
    bills: [],
    zipcode: '5210',
    lastName: 'Schoch',
    address: 'Breitacker 6b',
    email: 'r.schoch@elderbyte.com',
    firstName: 'Robin'
}

const b = {
    partnerId: 'r.schoch@elderbyte.com',
    billingDate: '2020-08-31T21:59:59.999Z',
    from: '2020-07-31T22:00:00.000Z',
    to: '2020-08-31T21:59:59.999Z',
    complete: false,
    paidAt: '',
    total: 24,
    distinctTotal: 1,
    price: 0.15
}

const r = [
    {
        res: {
            distinctTotal: 1,
            total: 24,
            price: 0.15,
            location: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
        },
        original: [
            {
                total: 0,
                reportDate: '2020-08-31T04:00:00.000Z',
                distinctTotal: 0,
                pricePerEntry: 0.15,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 24,
                reportDate: '2020-08-30T04:00:00.000Z',
                distinctTotal: 1,
                pricePerEntry: 0.15,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-29T04:00:00.000Z',
                distinctTotal: 0,
                pricePerEntry: 0.15,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-28T08:00:00.000Z',
                distinctTotal: 0,
                pricePerEntry: 0.8,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-28T04:00:00.000Z',
                distinctTotal: 0,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-27T04:00:00.000Z',
                distinctTotal: 0,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-26T04:00:00.000Z',
                distinctTotal: 0,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            },
            {
                total: 0,
                reportDate: '2020-08-25T04:00:00.000Z',
                distinctTotal: 0,
                locationId: 'cae69c18-ba20-461f-88c3-e9803b1f1ddb'
            }
        ]
    }
]

const createBillPDF = (partner, reports, bill) => {
    // Create a document
    const doc = new PDFDocument;

    doc.pipe(fs.createWriteStream('output.pdf'));

// Embed a font, set the font size, and render some text
    drawPartnerAddress(partner, doc)
    drawBillingDate(moment(bill.billingDate), doc)
    drawBillHeader(doc)
    drawTableHeader(doc)
    let nextPosition = 300
    for (let i = 0; i < reports.length; i++) {
        nextPosition = drawLocationTable(reports[i], doc, nextPosition, bill)
    }

    doc.end();
}


const drawPartnerAddress = (partner, doc) => {
    doc.fontSize(13)
       .text(partner.address, 450, 100)
       .text(partner.city)
       .text(partner.zipcode)

}

const drawBillingDate = (date, doc) => {
    doc.fontSize(13)
       .text("Rechnungsdatum " + date.format("DD MM YYYY"), 50, 100)
}

const drawBillHeader = (doc) => {
    doc.fontSize(40).text("Rechnung", 50, 250)
}

const drawTableHeader = (doc) => {
    doc.fontSize(13)
       .text("Datum", 50, 300)
       .text("Anzahl eindeutiger Besucher", 200, 300)
       .text("Gesamtpreis", 400, 300)
}

const drawLocationTable = (report, doc, startposition, bill) => {
    let nextPosition = startposition + 2 * 12
    for (let i = 0; i < report.original.length; i++) {
        drawTableColumn(report.original[i], doc, i, nextPosition)
        nextPosition = startposition + (i + 3) * 12
    }
    nextPosition = nextPosition + 20
    nextPosition = drawTableSeparator(bill, nextPosition)
    return nextPosition

}

const drawTableSeparator = (bill, startPosition) => {
    return startPosition
}

const drawTableColumn = (report, doc, index, nextPosition) => {
    doc.fontSize(11)
       .text(moment().format("DD.MM.YYYY"), 50, nextPosition)
       .text(report.distinctTotal, 200, nextPosition)
       .text((report.pricePerEntry ? report.pricePerEntry : 0.15) * report.distinctTotal + '.-', 400, nextPosition)
}


// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage


createBillPDF(p, r, b)

// Add an image, constrain it to a given size, and center it vertically and horizontally
/*
 doc.image('path/to/image.png', {
 fit: [250, 300],
 align: 'center',
 valign: 'center'
 });
 */

// Add another page
/*
 doc.addPage()
 .fontSize(25)
 .text('Here is some vector graphics...', 100, 100);
 */


// Draw a triangle
/*
 doc.save()
 .moveTo(100, 150)
 .lineTo(100, 250)
 .lineTo(200, 250)
 .fill("#FF3300");


 // Apply some transforms and render an SVG path with the 'even-odd' fill rule
 doc.scale(0.6)
 .translate(470, -380)
 .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
 .fill('red', 'even-odd')
 .restore();

 // Add some text with annotations
 /*
 doc.addPage()
 .fillColor("blue")
 .text('Here is a link!', 100, 100)
 .underline(100, 100, 160, 27, {color: "#0000FF"})
 .link(100, 100, 160, 27, 'http://google.com/');
 */


// Finalize PDF file

