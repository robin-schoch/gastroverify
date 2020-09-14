import express from "express";

import jwt  from 'jsonwebtoken';
import {getGastro} from '../db/gastroStorage'
import {getReports} from '../db/reportStorage'
import {v4} from 'uuid';
import moment from 'moment';
import bunyan from 'bunyan'


const log = bunyan.createLogger({name: "reportRoute", src: true});
export const router = express.Router();


router.get('/daily/:locationId', ((req, res) => {
    log.info({query: req.query},"request daily report")

    // @ts-ignore
    getGastro(req.xUser.email).then(user => {
        const location = user.locations.filter(l => l.locationId === req.params.locationId)[0]
        if (location !== null) {
            // @ts-ignore
            getReports(location.locationId, req.query.Limit ? req.query.Limit : 31, req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null, req.query.date ? moment(req.query.date) : moment())
                .then(elems => {
                    res.json(elems)
                }).catch(error => {
                log.error(error)
                res.status(503)
                res.json({error: "oh boy"})
            })
        } else {
            res.status(401)
            log.error("no location set")
            res.json({locationId: req.params.locationId,  cond: !!location, location: location})
        }

    }).catch(error => {
        log.error(error)
        res.status(404)
        res.json(error)
    })
}))

