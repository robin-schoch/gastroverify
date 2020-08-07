const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {createGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')

router.get('/', (req, res) => {
    getEntries('myBar', 2).then(data => {
        console.log(req.header('x-gastro'))
        res.json(req.header('x-gastro'))
    }).catch(error => res.json(error))
})

router.get('/:id', (req, res) => {

})

router.post('/', (req, res) => {
    let j = jwt.decode(req.header('Authorization'))


})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
