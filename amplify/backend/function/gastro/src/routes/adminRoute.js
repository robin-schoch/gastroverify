const express = require('express'), router = express.Router();
const {getGastro} = require('./../db/gastroStorage')
const {getEntries, updateGastro} = require('./../db/entryStorage')
const {Gastro, Bar} = require('./../domain/gastro')
const {addQrCodeMapping} = require('./../db/qrCodeMappingStorage')
const {uuid} = require('uuidv4');


router.get('/', (req, res) => {
    res.json({route: 'amdin'})

})

router.get('/:id', (req, res) => {

})

router.post('/', (req, res) => {


})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
