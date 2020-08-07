const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {getGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')

router.get('/', (req, res) => {
    // getGastro()
    getEntries('myBar', 2).then(data => {
        console.log(req.header('x-gastro'))
        res.json(req.header('x-gastro'))
    }).catch(error => res.json(error))
})


module.exports = router;
