const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Bar} = require("../domain/gastro");
const {createGastro, getGastro, updateGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')
const {v4: uuidv4} = require('uuid');
const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')


router.get('/', (req, res) => {
    getGastro(req.xUser.email).then(gastro => {
        res.json(gastro)
    }).catch(error => {
        res.json(error)
    })

})

router.get('/:id', (req, res) => {
    getGastro(req.xUser.email).then(gastro => {
        res.json(gastro)
    }).catch(error => {
        res.json(error)
    })

})

router.post('/:id/bar', (req, res) => {
    const bar = new Bar(req.body.barid, req.body.name, req.body.street, req.body.city, req.body.zipcode, uuidv4(), uuidv4(), true)
    console.log(bar)
    if (!bar.barid) {
        res.status(409)
        res.json(bar)
    }
    getGastro(req.xUser.email).then(gastor => {
        if (gastor.bars.map(bars => bars.barid).includes(bar.barid)) {
            res.json({error: 'bar id already exits'})
        } else {
            gastor.bars.push(bar)
            console.log(gastor)
            Promise.all([
                updateGastro(gastor),
                addQrCodeMapping({
                    qrCodeId: bar.checkInCode,
                    ownerId: gastor.email,
                    barName: bar.barid,
                    checkIn: true
                }), addQrCodeMapping({
                    qrCodeId: bar.checkOutCode,
                    ownerId: gastor.email,
                    barName: bar.barid,
                    checkIn: false
                })]).then(([a, b, c]) => {
                res.json(a)
            }).catch(error => {
                res.status(500)
                res.json(error)
            })
        }
    })
})

router.delete('/:id/bar/:barId', (req, res) => {
    getGastro(req.xUser.email).then(gastor => {
        console.log(req.params.barId)
        let bar = gastor.bars.filter(bars => bars.barid === req.params.barId)[0]
        Promise.all([deleteQrMapping(bar.checkInCode, gastor.email), deleteQrMapping(bar.checkOutCode, gastor.email)])
            .then(elem => {
                gastor.bars = gastor.bars.filter(bars => bars.barid !== req.params.barId)
                updateGastro(gastor).then(success => {
                    res.json(success)
                }).catch(error => {
                    res.status(500)
                    res.json(error)
                })
            }).catch(error => {
            res.status(512)
            res.json(error)
        })

    })
})

router.post('/', (req, res) => {
    createGastro(req.xUser.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.zipcode).then(success => {
        res.json(success)
    })

})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
