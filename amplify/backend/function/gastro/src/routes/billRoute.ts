import {Router} from 'express';


import {monthlyReport} from '../db/monthlyReport';


import {createLogger} from 'bunyan';
import {isNotDynamodbError, Page} from '../util/dynamoDbDriver';
import {MonthlyReport} from '../domain/monthlyReport';

const monthlyStorage = new monthlyReport();

const log = createLogger({name: 'billRoute', src: true});
export const router = Router();
router.get(
    '/:partnerId',
    ((req, res) => {
            // @ts-ignore
            monthlyStorage.findPaged(req.xUser.email).subscribe(elem => {
                if (isNotDynamodbError<Page<MonthlyReport>>(elem)) {
                    res.status(500);
                    log.error(elem);
                }
                res.json(elem);
            });

        }
    )
);


