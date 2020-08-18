const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Location} = require("../domain/partner");
const {createGastro, getGastro, createNewPartner} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')
const {v4: uuidv4} = require('uuid');
const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')


router.post('/', (req, res) => {
    createNewPartner(req.xUser.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.zipcode).then(success => {
        res.json(success)
    })
})
