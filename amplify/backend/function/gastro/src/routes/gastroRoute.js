const express = require('express'), router = express.Router();
const jwt = require('jsonwebtoken');
const {Location} = require("../domain/partner");
const {createNewPartner, getGastro, createPartner} = require('./../db/gastroStorage')
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
    let payment = !!req.body.senderID ? "default" : "premium"
    const location = new Location(uuidv4(), req.body.name, req.body.street, req.body.city, req.body.zipcode, uuidv4(), uuidv4(), true, payment , req.body.senderID)
    console.log(location)
    if (!location.locationId) {
        res.status(409)
        res.json(location)
    }
    getGastro(req.xUser.email).then(gastor => {
        if (gastor.locations.map(l => l.locationId).includes(location.locationId)) {
            res.json({error: 'location id already exits'})
        } else {
            gastor.locations.push(location)
            Promise.all([
                createPartner(gastor),
                addQrCodeMapping({
                    qrId: location.checkInCode,
                    ownerId: gastor.email,
                    locationId: location.locationId,
                    locationName: location.name,
                    checkIn: true,
                    senderID: location.senderID
                }), addQrCodeMapping({
                    qrId: location.checkOutCode,
                    ownerId: gastor.email,
                    locationId: location.locationId,
                    locationName: location.name,
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
    getGastro(req.xUser.email).then(partner => {
        console.log(req.params.barId)
        let location = partner.locations.filter(l => l.locationId === req.params.barId)[0]
        Promise.all([deleteQrMapping(location.checkInCode, partner.email), deleteQrMapping(location.checkOutCode, partner.email)])
            .then(elem => {
                partner.locations = partner.locations.filter(l => l.locationId !== req.params.barId)
                createPartner(partner).then(success => {
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
    createNewPartner(req.xUser.email, req.body.firstName, req.body.lastName, req.body.address, req.body.city, req.body.zipcode).then(success => {
        res.json(success)
    })

})

router.put('/:id', ((req, res) => {
    const g = new Partner(email, firstName, lastName, address, city, zipcode)

    createPartner(g).then(success => {
        res.json(success)
    })
}))


module.exports = router;
