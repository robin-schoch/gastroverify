const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {createGastro, getGastro, updateGastro} = require('./../db/gastroStorage')
const {getEntries} = require('./../db/entryStorage')

const {addQrCodeMapping, deleteQrMapping} = require('./../db/qrCodeMappingStorage')
router.get('/', (req, res) => {


})

router.get('/:id', (req, res) => {
    getGastro(req.xUser.email).then(gastro => {
        res.json({gastro})
    }).catch(error => {
        res.json(error)
    })

})

router.post('/:id/bar', (req, res) => {
    const bar = new Bar(req.body.barId, req.body.barName, req.body.street, req.body.city, req.body.zipcode, uuid(), uuid(), true)
    getGastro(req.xUser.email).then(gastor => {
        if (gastor.bars.map(bars => bars.barid).includes(bar.barid)) {
            res.json({error: 'bar id already exits'})
        } else {
            gastor.bars.push(bar)
            const updateGastro = updateGastro(gastor)
            const addMappingOut = addQrCodeMapping({
                qrCodeId: bar.checkOutCode,
                ownerId: gastor.email,
                barName: bar.name,
                checkIn: false
            })
            const addMappingIn = addQrCodeMapping({
                qrCodeId: bar.checkInCode,
                ownerId: gastor.email,
                barName: bar.name,
                checkIn: true
            })

            Promise.all([updateGastro, addMappingIn, addMappingOut]).then(([a, b, c]) => {
                res.json({success: bar})
            })
        }
    })
})

router.delete('/:id/bar/:barId', (req, res) => {
    getGastro(req.xUser.email).then(gastor => {

        let bar = gastor.bars.filter(bars => bars.barid === req.params.barId)[0]
        Promise.all([deleteQrMapping(bar.checkInCode), deleteQrMapping(bar.checkOutCode)]).then(elem => {
            gastor.bars = gastor.bars.filter(bars => bars.barid !== req.params.barId)
            updateGastro(gastor).then(success => {
                res.json({success})
            })
        })

    })
})

router.post('/', (req, res) => {
    createGastro(req.xUser.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.city).then(success => {
        res.json(success)
    })

})

router.put('/:id', ((req, res) => {

}))


module.exports = router;
