const {getEntries} = require("../db/entryStorage");
const express = require('express'), router = express.Router();
const {getReports} = require("../db/reportStorage");
const {getGastro, getAllPartner} = require('./../db/gastroStorage')


router.get('/partner', (req, res) => {
    getAllPartner(req.query.LastEvaluatedKey).then(data => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

router.get('/partner/:id', (req, res) => {
    getGastro(req.params.id).then(elem => res.json(elem)).catch(err => res.json(err))

})

router.get('/partner/:id/entries/:locationId', (req, res) => {
    getEntries(req.params.locationId, req.query.Limit ? req.query.Limit : 100, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
        .then(elems => {
            res.json(elems)
        }).catch(error => {
        console.log(error)
        res.status(503)
        res.json({error: "oh boy"})
    })

})


router.get('/partner/:id/report/:locationId', (req, res) => {
    getReports(req.params.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
        .then(elems => {
            res.json(elems)
        }).catch(error => {
        console.log(error)
        res.status(503)
        res.json({error: "oh boy"})
    })

})

router.post('/', (req, res) => {


})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
