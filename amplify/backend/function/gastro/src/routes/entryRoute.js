const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {getGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')
const {parse} = require('json2csv');

const fields = [
    {
        label: 'First Name',
        value: 'FirstName'
    },
    {
        label: 'Last Name',
        value: 'LastName'
    },
    {
        label: 'Street',
        value: 'Street'
    },
    {
        label: 'City',
        value: 'City'
    },
    {
        label: 'Zipcode',
        value: 'Zipcode'
    },
    {
        label: 'Email',
        value: 'Email'
    },
    {
        label: 'PhoneNumber',
        value: 'PhoneNumber'
    },
    {
        label: 'EntryTime',
        value: 'EntryTime'
    },
];
// 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime'

router.get('/:barId', (req, res) => {
    getGastro(req.xUser.email).then(user => {
        const bar = user.bars.filter(bar => bar.barid === req.params.barId)[0]
        console.log(req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : "no last key")
        if (bar !== null) {
            getEntries(bar.barid, req.query.Limit ? req.query.Limit : 2, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                res.status(500)
                res.json(error)
            })
        } else {
            res.status(401)
            res.json({barid: req.params.barId, bars: user.bars, cond: !!bar, bar: bar})
        }

    }).catch(error => {
        res.status(404)
        res.json(error)
    })
})

const downloadResource = (res, fileName, fields, data) => {
    const csv = parse(data, {fields})
    console.log('createt elem')
    console.log(csv)
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    res.send(csv);
}


router.get('/:barId/export', (req, res) => {
    getGastro(req.xUser.email).then(async (user) => {
        const bar = user.bars.filter(bar => bar.barid === req.params.barId)[0]
        if (bar !== null) {
            let lastKey = null
            let data = []
            do {
                entries = await getEntries(bar.barid, 1000, lastKey)
                console.log(entries)
                data = [...data, ...entries.Data]
                lastKey = entries.LastEvaluatedKey
                console.log("added element to csv")
            }
            while (!!lastKey)
            console.log("we have so many datapoints " + data.length)
            downloadResource(res, "besucherliste.csv", fields, data)
        }
    })
})

router.get('/export/csv', (req, res) => {
    const csv = parse([{name: "robin", lastname: "schoch"}, {name: "kathi", lastname: "rofka"}])
    console.log(csv)
    console.log('created test')
    res.header('Content-Type', 'text/csv');
    res.attachment('fileName.csv');
    res.send(csv);
})

module.exports = router;
