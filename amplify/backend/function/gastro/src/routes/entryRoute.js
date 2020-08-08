const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {getGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')


router.get('/:barId', (req, res) => {
    getGastro(req.xUser.email).then(user => {
        const bar = user.bars.filter(bar => bar.barid)[0]
        if (bar) {
            getEntries(bar.barid, req.query.Limit ? req.query.Limit : 200, req.query.LastEvaluatedKey ? req.query.LastEvaluatedKey : null)
                .then(elems => {
                    res.json(elems)
                })
        }
        res.status(401)
        res.json({})
    }).catch(error => {
        res.status(404)
        res.json(error)
    })
})


module.exports = router;
