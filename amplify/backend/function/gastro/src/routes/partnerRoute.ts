import {Router} from 'express';
import {forkJoin, of, throwError} from 'rxjs';

import {Location, Partner} from '../domain/partner';
import {createLogger} from 'bunyan';
import {QrCodeMappingStorage} from '../db/qrCodeMappingStorage';

import {partnerStorage} from '../db/partnerStorage';
import {locationStorage} from '../db/locationStorage';
import {isNotDynamodbError} from '../util/dynamoDbDriver';
import {QrCodeMapping} from '../domain/qrCodeMapping';
import {mergeMap, switchMap, tap} from 'rxjs/operators';
import {Page} from '../domain/page';

const log = createLogger({name: 'partnerRoute', src: true});
const storage = new partnerStorage();
const locationstorage = new locationStorage();
const mappingStorage = new QrCodeMappingStorage();

export const router = Router();

router.get(
    '/',
    (req: any, res) => {
      // @ts-ignore
      forkJoin([
        storage.findPartner(req.xUser.email).pipe(
            switchMap(a => isNotDynamodbError<Partner>(a) ? of(a) : throwError(a)),
        ),
        locationstorage.findLocations(req.xUser.email).pipe(
            switchMap(inner => isNotDynamodbError<Page<Location>>(inner) ? of(inner) : throwError(inner)),
        ),
      ]).subscribe(
          ([partner, locations]) => {
            partner.locations = locations.Data;
            log.info(locations);
            res.json(partner);
          },
          error => {
            log.error(error);
            res.status(500);
            res.json(error);
          }
      );
    }
);

router.get(
    '/:id',
    (req: any, res) => {
      forkJoin([
        storage.findPartner(req.xUser.email).pipe(
            switchMap(inner => isNotDynamodbError(inner) ? of(inner) : throwError(inner)),
        ),
        locationstorage.findLocations(req.xUser.email).pipe(
            switchMap(inner => isNotDynamodbError<Page<Location>>(inner) ? of(inner) : throwError(inner)),
        ),
      ]).subscribe(
          ([partner, locations]) => {
            partner.locations = locations.Data;
            log.info(locations);
            res.json(partner);
          },
          error => {
            log.error(error);
            res.status(500);
            res.json(error);
          }
      );

    }
);


router.post(
    '/:id/bar',
    (req, res) => {
      const location = Location.fromRequest(req);
      log.info(location);
      if (!location.locationId) {
        res.status(409);
        res.json(location);
      }
      forkJoin([
        locationstorage.createLocation(location),
        mappingStorage.createMapping(QrCodeMapping.fromLocation(
            location,
            location.partnerId,
            true
        )),
        mappingStorage.createMapping(QrCodeMapping.fromLocation(
            location,
            location.partnerId,
            false
        ))
      ]).pipe(
          switchMap(([partner, qr1, qr2]) => {
            if (!isNotDynamodbError(partner)) return throwError(partner);
            if (!isNotDynamodbError(qr1)) return throwError(qr1);
            if (!isNotDynamodbError(qr2)) return throwError(qr2);
            return of(location);
          })
      ).subscribe(
          (location) => {
            res.json(location);
          },
          (error) => {
            res.status(500);
            res.json(error);
          }
      );
    }
);

router.delete('/:id/bar/:barId', (req:any, res) => {
      locationstorage.changeActivateLocation(
          // @ts-ignore
          req.xUser.email,
          req.params.barId,
          false
      ).pipe(
         // tap(elem => log.info(elem)),
          switchMap((inner) => isNotDynamodbError<Partial<Location>>(inner) ? of(inner) : throwError(inner)),
          mergeMap((location) => forkJoin([
            mappingStorage.deleteMapping(location.checkInCode).pipe(
                switchMap((inner) => isNotDynamodbError<Partial<QrCodeMapping>>(inner) ?
                                     of(inner) :
                                     throwError(inner)),
            ),
            mappingStorage.deleteMapping(location.checkOutCode).pipe(
                switchMap((inner) => isNotDynamodbError<Partial<QrCodeMapping>>(inner) ?
                                     of(inner) :
                                     throwError(inner)),
            ),
            of(location)
          ]))
      ).subscribe(([qr1, qr2, location]) => {

            res.json(location);
          },
          error => {
            log.error(error);
            res.json(error);
          });
    }
);

router.put('/:id/bar/:barId', (req: any, res) => {
  log.info({
    a: req.xUser.email,
    B: req.params.barId,
    x: true
  });
  locationstorage.changeActivateLocation(
      // @ts-ignore
      req.xUser.email,
      req.params.barId,
      true
  ).pipe(
      tap(elem => log.info(elem)),
      switchMap((inner) => isNotDynamodbError<Partial<Location>>(inner) ? of(inner) : throwError(inner)),
      mergeMap((location: Location) => forkJoin([
        mappingStorage.createMapping(QrCodeMapping.fromLocation(location, location.partnerId, true)).pipe(
            tap(inner => log.info(inner)),
            switchMap((inner) => isNotDynamodbError<Partial<QrCodeMapping>>(inner) ?
                                 of(inner) :
                                 throwError(inner)),
        ),
        mappingStorage.createMapping(QrCodeMapping.fromLocation(location, location.partnerId, false)).pipe(
            tap(inner => log.info(inner)),
            switchMap((inner) => isNotDynamodbError<Partial<QrCodeMapping>>(inner) ?
                                 of(inner) :
                                 throwError(inner)),
        ),
        of(location)
      ]))
  ).subscribe(([qr1, qr2, location]) => {
        log.info(location);
        log.info(qr2);
        log.info(qr1);
        res.json(location);
      },
      error => {
        log.error(error);
        res.json(error);
      });
});


router.post(
    '/',
    (req, res) => {
      storage.createPartner(
          Partner.fromRequest(req)
      ).subscribe(success => {
        res.json(success);
      });

    }
);


