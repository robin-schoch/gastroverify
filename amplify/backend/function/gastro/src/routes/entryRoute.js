const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {getGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')
const {parse} = require('json2csv');

const fields = [
    {
        label: 'First Name',
        value: 'firstName'
    },
    {
        label: 'Last Name',
        value: 'lastName'
    },
    {
        label: 'Street',
        value: 'street'
    },
    {
        label: 'City',
        value: 'City'
    },
    {
        label: 'Zipcode',
        value: 'zipCode'
    },
    {
        label: 'Email',
        value: 'email'
    },
    {
        label: 'PhoneNumber',
        value: 'phoneNumber'
    },
    {
        label: 'EntryTime',
        value: 'entryTime'
    },
];
// 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime'

router.get('/:barId', (req, res) => {
    getGastro(req.xUser.email).then(user => {
        console.log(user)
        const location = user.locations.filter(l => l.locationId === req.params.barId)[0]
        console.log(location)
        console.log(req.query)
        console.log(req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : "no last key")
        if (location !== null) {
            getEntries(location.locationId, req.query.Limit ? req.query.Limit : 10, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                res.status(500)
                res.json(error)
            })
        } else {
            res.status(401)
            res.json({barid: req.params.barId, bars: user.bars, cond: !!location, location: location})
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
        const location = user.locations.filter(l => l.locationId === req.params.barId)[0]
        if (location !== null) {
            let lastKey = null
            let data = []
            do {
                entries = await getEntries(location.locationId, 1000, lastKey)
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

module.exports = router;
