import * as moment from 'moment';
import {Router} from 'express';
import {createLogger} from 'bunyan';
import {isNotDynamodbError} from '../util/dynamoDbDriver';
import {switchMap} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {entryStorage} from '../db/entryStorage';
import {reportStorage} from '../db/reportStorage';
import {Page} from '../domain/page';
import {DailyReport} from '../domain/DailyReport';
import {locationStorage} from '../db/locationStorage';
import {Location} from '../domain/partner';


const {monthlyReport} = require('../db/monthlyReport');
const {partnerStorage} = require('../db/partnerStorage');

const monthlyReportStorage = new monthlyReport();

const locationstorage = new locationStorage();
const log = createLogger({name: 'adminRoute', src: true});
export const router = Router();
const reportstorage = new reportStorage();
const storage = new partnerStorage();
const entrystorage = new entryStorage();
/***************************************************************************
 *                                                                         *
 * partner                                                                 *
 *                                                                         *
 **************************************************************************/

router.get('/partner', (req, res) => {

      storage.findPartnerPaged(100, req.query.LastEvaluatedKey)
             .pipe(switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)))
             .subscribe((pagePartner) => res.json(pagePartner),
                 error => {
                   res.status(500);
                   res.json(error);
                 }
             );
    }
);

router.get('/partner/:id', (req, res) => {
      storage.findPartner(req.params.id)
             .pipe(switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)))
             .subscribe((partner) => {res.json(partner);},
                 error => {
                   res.status(500);
                   res.json(error);
                 }
             );
    }
);

router.get('/partner/:id/location', ((req, res) => {
      locationstorage.findLocations(req.params.id, 100, null)
                     .pipe(switchMap(a => isNotDynamodbError<Page<Location>>(a) ? of(a) : throwError(a)))
                     .subscribe(locations => {res.json(locations);},
                         error => {
                           res.status(500);
                           res.json(error);
                         }
                     );
    })
);

router.put('/partner/:id/hide', (req, res) => {
      console.log(req.query.hide);
      console.log(req.query.hide === 'true');
      storage.hidePartner(req.params.id, req.query.hide === 'true')
             .pipe(switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)))
             .subscribe(elem => {
                   res.json(Object.assign({}, {email: req.params.id}, elem));
                 },
                 error => {
                   res.status(500);
                   res.json(error);
                 }
             );

    }
);

router.get('/partner/:id/entries/:locationId', (req, res) => {
      // @ts-ignore
      /*
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
       */
    }
);


router.get('/partner/:id/report/:locationId', (req, res) => {
      reportstorage.findPaged(req.params.locationId, req.query.Limit ? req.query.Limit : 31,
          // @ts-ignore
          req.query.LastEvaluatedKey ? JSON.parse(req.query.LastEvaluatedKey) : null,
          // @ts-ignore
          moment(req.query.date))
                   .pipe(switchMap(a => isNotDynamodbError<Page<DailyReport>>(a) ? of(a) : throwError(a)))
                   .subscribe(reports => {res.json(reports);},
                       error => {
                         res.status(500);
                         res.json(error);
                       }
                   );
    }
);

router.get('/partner/:partnerId/bill', (req, res) => {
      monthlyReportStorage.findPaged(req.params.partnerId)
                          .pipe(switchMap(a => isNotDynamodbError(a) ? of(a) : throwError(a)))
                          .subscribe(elem => {res.json(elem);},
                              error => {
                                res.status(500);
                                res.json(error);
                              }
                          );

    }
);

router.put('/partner/:partnerId/bill/:billingDate', (req, res) => {
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
 * referral                                                                   *
 *                                                                         *
 **************************************************************************/


router.put('/partner/:partnerId/referral', ((req, res) => {
  const success = req.body.up ?
                  storage.addReferral(req.params.partnerId) :
                  storage.removeReferral(req.params.partnerId);
  success.subscribe(success => res.json({success: true}));
  success.subscribe(error => {
    res.status(500);
    res.json({success: false});
  });

}));
