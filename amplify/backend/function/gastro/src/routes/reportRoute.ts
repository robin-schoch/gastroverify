import {Router} from 'express';
import {partnerStorage} from '../db/partnerStorage';
import {reportStorage} from '../db/reportStorage';
import * as moment from 'moment';
import {createLogger} from 'bunyan';
import {isNotDynamodbError, Page} from '../util/dynamoDbDriver';
import {mergeMap, switchMap} from 'rxjs/operators';
import {DailyReport} from '../domain/DailyReport';
import {locationStorage} from '../db/locationStorage';
import {Location} from '../domain/partner';
import {of, throwError} from 'rxjs';


const log = createLogger({name: 'reportRoute', src: true});
export const router = Router();
const storage = new reportStorage();
const partStorage = new partnerStorage();
const locationstorage = new locationStorage();

router.get(
    '/daily/:locationId',
    ((req: any, res) => {
        log.info(
            {query: req.query},
            'request daily report'
        );

        locationstorage.findLocation(
            req.xUser.email,
            req.params.locationId
        ).pipe(
            switchMap(a => isNotDynamodbError<Location>(a) ? of(a) : throwError(a)),
            mergeMap((location) => storage.findPaged(
                location.locationId,
                req.query.Limit ? req.query.Limit : 31,
                req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null,
                req.query.date ? moment(req.query.date) : moment()
            )),
            switchMap((a) => isNotDynamodbError<Page<DailyReport>>(a) ? of(a) : throwError(a)),
        ).subscribe(
            (values) => {
                res.json(values);
            },
            (error) => {
                res.status(500);
                res.json(error);
            }
        );

    })
);

