import {Router} from 'express';
import {partnerStorage} from '../db/partnerStorage';
import {reportStorage} from '../db/reportStorage';
import * as moment from 'moment';
import {createLogger} from 'bunyan';
import {isNotDynamodbError, Page} from '../util/dynamoDbDriver';
import {filter, map, mergeMap} from 'rxjs/operators';
import {DailyReport} from '../domain/DailyReport';


const log = createLogger({name: 'reportRoute', src: true});
export const router = Router();
const storage = new reportStorage();
const partStorage = new partnerStorage();

router.get(
    '/daily/:locationId',
    ((req, res) => {
        log.info(
            {query: req.query},
            'request daily report'
        );

        // @ts-ignore
        partStorage.findPartner(req.xUser.email).pipe(
            filter(isNotDynamodbError),
            map(partner => partner.locations.filter(l => l.locationId === req.params.locationId)[0]),
            filter(location => !!location),
            mergeMap(location => storage.findPaged(
                location.locationId,
                req.query.Limit ? req.query.Limit : 31,
                // @ts-ignore
                req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null,
                // @ts-ignore
                req.query.date ? moment(req.query.date) : moment()
            ))
        ).subscribe(value => {
            if (!isNotDynamodbError<Page<DailyReport>>(value)) {
                log.error(value);
                res.status(503);
            }
            res.json(value);

        });


}))

