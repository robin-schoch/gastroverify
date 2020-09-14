import express from 'express';


import {getBills} from '../db/monthlyReport';


import bunyan from 'bunyan';

const log = bunyan.createLogger({name: 'billRoute', src: true});
export const router = express.Router();
router.get(
    '/:partnerId',
    ((req, res) => {
            // @ts-ignore
            getBills(req.xUser.email).then(elem => {
                res.json(elem);
            }).catch(err => {
                log.error(err);
                res.status(401);
                res.json({error: err});
            });

        }
    )
);


