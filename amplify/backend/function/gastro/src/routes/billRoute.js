const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Location} = require("../domain/partner");
const {createGastro, getGastro, createNewPartner} = require('./../db/gastroStorage')
const {getReports} = require('./../db/reportStorage')
const {getBills} = require('./../db/monthlyReport')
const {v4: uuidv4} = require('uuid');
const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')


router.get('/:partnerId', ((req, res) => {
        getBills(req.xUser.email).then(elem => {
            res.json(elem)
        }).catch(err => {
            console.log(err)
            res.status(401)
            res.json({error: err})
        })

    }
))


module.exports = router;
