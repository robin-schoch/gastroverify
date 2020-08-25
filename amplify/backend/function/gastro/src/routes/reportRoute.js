const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Location} = require("../domain/partner");
const {createGastro, getGastro, createNewPartner} = require('./../db/gastroStorage')
const {getReports} = require('./../db/reportStorage')
const {v4: uuidv4} = require('uuid');
const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')



router.get('/daily/:locationId', ((req, res) => {
    getGastro(req.xUser.email).then(user => {
        const location = user.locations.filter(l => l.locationId === req.params.locationId)[0]
        if (location !== null) {
            getReports(location.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null)
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                console.log(error)
                res.status(503)
                res.json({error: "oh boy"})
            })
        } else {
            res.status(401)
            res.json({locationId: req.params.locationId,  cond: !!location, location: location})
        }

    }).catch(error => {
        res.status(404)
        res.json(error)
    })
}))


module.exports = router;
