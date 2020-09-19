import * as moment from 'moment';
import {Router} from 'express';
import {createLogger} from 'bunyan';
import {isNotDynamodbError} from '../util/dynamoDbDriver';

const {getEntries} = require('../db/entryStorage');

const {getReports} = require('../db/reportStorage');
const {monthlyReport} = require('../db/monthlyReport');
const {getGastro, getAllPartner} = require('../db/gastroStorage');
const {partnerStorage} = require('../db/partnerStorage');

const monthlyReportStorage = new monthlyReport();


const log = createLogger({name: 'adminRoute', src: true});
export const router = Router();

const storage = new partnerStorage();
/***************************************************************************
 *                                                                         *
 * partner                                                                 *
 *                                                                         *
 **************************************************************************/

router.get(
    '/partner',
    (req, res) => {
        getAllPartner(req.query.LastEvaluatedKey).then(data => {
            res.json(data);
        }).catch(err => {
            log.error(err);
            res.json(err);
        });
    }
);

router.get(
    '/partner/:id',
    (req, res) => {
        getGastro(req.params.id).then(elem => res.json(elem)).catch(err => {
            log.error(err);
            res.json(err);
        });

    }
);


router.put(
    '/partner/:id/hide',
    (req, res) => {

        console.log(req.query.hide);
        console.log(req.query.hide === 'true');
        storage.hidePartner(
            req.params.id,
            req.query.hide === 'true'
        ).subscribe(elem => {
            if (!isNotDynamodbError(elem)) res.status(500);
            res.json(Object.assign(
                {},
                {email: req.params.id},
                elem
            ));
        });

    }
);

router.get(
    '/partner/:id/entries/:locationId',
    (req, res) => {
        // @ts-ignore
        getEntries(
            req.params.locationId,
            req.query.Limit ? req.query.Limit : 100,
            // @ts-ignore
            req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null
        )
            .then(elems => {
                res.json(elems);
            }).catch(error => {
            log.error(error);
            res.status(503);
            res.json({error: 'oh boy'});
        });

    }
);


router.get(
    '/partner/:id/report/:locationId',
    (req, res) => {

        // @ts-ignore
        getReports(
            req.params.locationId,
            req.query.Limit ? req.query.Limit : 31,
            // @ts-ignore
            req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null,
            // @ts-ignore
            moment(req.query.date)
        )
            .then(elems => {
                res.json(elems);
            }).catch(error => {
            log.error(error);
            res.status(503);
            res.json({error: 'oh boy'});
        });

    }
);

router.get(
    '/partner/:partnerId/bill',
    (req, res) => {

        monthlyReportStorage.findPaged(req.params.partnerId).subscribe(elem => {
            if (!isNotDynamodbError(elem)) {
                res.status(500);
                log.error(elem);
            }
            res.json(elem);
        });

    }
);

router.put(
    '/partner/:partnerId/bill/:billingDate',
    (req, res) => {
        log.info(req);
        monthlyReportStorage.completeReport(
            req.params.partnerId,
            req.params.billingDate,
            req.body.complete
        ).subscribe(elem => {
            if (!isNotDynamodbError(elem)) {
                res.status(500);
                log.error(elem);
            }
            res.json(elem);
        });

    }
);

/***************************************************************************
 *                                                                         *
 * bills                                                                   *
 *                                                                         *
 **************************************************************************/


