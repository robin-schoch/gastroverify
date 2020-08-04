const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {createGastro} = require('./../db/gastroStorage')

router.get('/', (req, res) => {

})

router.get('/:id', (req, res) => {

})

router.post('/', (req, res) => {
  let j = jwt.decode(req.header('Authorization'))



})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
