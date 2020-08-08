const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {getGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')


router.get('/:barId', (req, res) => {
    getGastro(req.xUser.email).then(user => {
        const bar = user.bars.filter(bar => bar.barid === req.params.barId)[0]

        if (bar !== null) {
            getEntries(bar.barid, req.query.Limit ? req.query.Limit : 2, req.query.LastEvaluatedKey ? req.query.LastEvaluatedKey : null)
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                res.status(500)
                res.json(error)
            })
        } else {
            res.status(401)
            res.json({barid: req.params.barId, bars: user.bars, cond: !!bar, bar: bar})
        }

    }).catch(error => {
        res.status(404)
        res.json(error)
    })
})


module.exports = router;
