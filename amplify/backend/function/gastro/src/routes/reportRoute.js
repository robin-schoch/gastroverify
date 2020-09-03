const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Location} = require("../domain/partner");
const {createGastro, getGastro, createNewPartner} = require('./../db/gastroStorage')
const {getReports} = require('./../db/reportStorage')
const {v4: uuidv4} = require('uuid');
const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')
const moment = require('moment');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "reportRoute", src: true});


router.get('/daily/:locationId', ((req, res) => {
    log.info({query: req.query},"request daily report")
    getGastro(req.xUser.email).then(user => {
        const location = user.locations.filter(l => l.locationId === req.params.locationId)[0]
        if (location !== null) {
            getReports(location.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null, req.query.date ? moment(req.query.date) : moment())
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                log.error(error)
                res.status(503)
                res.json({error: "oh boy"})
            })
        } else {
            res.status(401)
            log.error("no location set")
            res.json({locationId: req.params.locationId,  cond: !!location, location: location})
        }

    }).catch(error => {
        log.error(error)
        res.status(404)
        res.json(error)
    })
}))


module.exports = router;
