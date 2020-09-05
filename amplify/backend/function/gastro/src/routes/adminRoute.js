const {getEntries} = require("../db/entryStorage");
const express = require('express'), router = express.Router();
const {getReports} = require("../db/reportStorage");
const {getBills, completeBill, incompleteBill} = require("../db/monthlyReport");
const {getGastro, getAllPartner} = require('./../db/gastroStorage')
const moment = require('moment');


const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "adminRoute", src: true});


router.get('/partner', (req, res) => {
    getAllPartner(req.query.LastEvaluatedKey).then(data => {
        res.json(data)
    }).catch(err => {
        log.error(err)
        res.json(err)
    })
})

router.get('/partner/:id', (req, res) => {
    getGastro(req.params.id).then(elem => res.json(elem)).catch(err => {
        log.error(err)
        res.json(err)
    })

})

router.get('/partner/:id/entries/:locationId', (req, res) => {
    getEntries(req.params.locationId, req.query.Limit ? req.query.Limit : 100, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
        .then(elems => {
            res.json(elems)
        }).catch(error => {
        log.error(error)
        res.status(503)
        res.json({error: "oh boy"})
    })

})


router.get('/partner/:id/report/:locationId', (req, res) => {

    getReports(req.params.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null, moment(req.query.date))
        .then(elems => {
            res.json(elems)
        }).catch(error => {
        log.error(error)
        res.status(503)
        res.json({error: "oh boy"})
    })

})

router.get('/partner/:partnerId/bill', (req, res) => {

    getBills(req.params.partnerId).then(elem => {
        res.json(elem)
    }).catch(err => {
        log.error(err)
        res.status(500)
        res.json({error: "ob boy"})
    })

})

router.put('/partner/:partnerId/bill/:billingDate', (req, res) => {
    const operation = req.body.complete ?
        completeBill(req.params.partnerId, req.params.billingDate) :
        incompleteBill(req.params.partnerId, req.params.billingDate)

    operation.then(elem => {
        log.info(elem, "updated bill")
        res.json(elem)
    }).catch(err => {
        res.status(500)
        log.error(err)
        res.json({error: err})
    })

})

router.post('/', (req, res) => {


})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
