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
    let payment = !req.body.senderID ? "default" : "premium"
    const location = new Location(uuidv4(), req.body.name, req.body.street, req.body.city, req.body.zipcode, uuidv4(), uuidv4(), true, payment, req.body.senderID, req.body.smsText)
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
                    senderID: location.senderID,
                    smsText: location.smsText
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

router.put('/:id/bar/:locationId', (req, res) => {

    let id = req.password.locationId
    if (!id) {
        res.status(409)
        res.json({error: "no location"})
    }
    getGastro(req.xUser.email).then(gastor => {
        if (gastor.locations.map(l => l.locationId).includes(id)) {
            let location = gastor.locations.filter(l => l.locationId === id)[0]
            let a = new Location(location.locationId,
                !!req.body.name ? req.body.name : location.name,
                !!req.body.street ? req.body.street : location.street,
                !!req.body.city ? req.body.city : location.city,
                !!req.body.zipcode ? req.body.zipcode : location.zipcode,
                location.checkOutCode,
                location.checkInCode,
                location.active,
                location.payment,
                !!req.body.senderID ? req.body.senderID : location.senderID,
                !!req.body.smsText ? req.body.smsText : location.smsText
            )
            gastor.locations = gastor.locations.filter(l => l.locationId !== req.params.barId)
            gastor.locations.push(a)
            Promise.all([
                addQrCodeMapping({
                    qrId: a.checkInCode,
                    ownerId: gastor.email,
                    locationId: a.locationId,
                    locationName: a.name,
                    checkIn: true,
                    senderID: a.senderID,
                    smsText: a.smsText
                }), addQrCodeMapping({
                    qrId: location.checkOutCode,
                    ownerId: gastor.email,
                    locationId: location.locationId,
                    locationName: location.name,
                    checkIn: false
                })]).then(([a, b]) => {
                    createPartner(gastor).then( elem => {
                        res.json(gastor)
                    })
            }).catch(error => {
                res.status(500)
                res.json(error)
            })

        } else {
            res.status(409)
            res.json({error: "no location"})
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
