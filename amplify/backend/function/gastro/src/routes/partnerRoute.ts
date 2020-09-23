import {Router} from 'express';


import {Location, Partner} from '../domain/partner';
import {createLogger} from 'bunyan';
import {QrCodeMappingStorage} from '../db/qrCodeMappingStorage';

import {partnerStorage} from '../db/partnerStorage';
import {isNotDynamodbError} from '../util/dynamoDbDriver';
import {QrCodeMapping} from '../domain/qrCodeMapping';
import {forkJoin} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';

const log = createLogger({name: 'partnerRoute', src: true});
const storage = new partnerStorage();
const mappingStorage = new QrCodeMappingStorage();

export const router = Router();

router.get(
    '/',
    (req, res) => {
        // @ts-ignore
        storage.findPartner(req.xUser.email).subscribe(parter => {
            if (!isNotDynamodbError(parter)) {
                res.status(500);
                log.error(parter);
            }
            res.json(parter);
        });
    }
);

router.get(
    '/:id',
    (req, res) => {
        // @ts-ignore
        storage.findPartner(req.xUser.email).subscribe(partner => {
            if (!isNotDynamodbError(partner)) {
                res.status(500);
                log.error(partner);
            }
            res.json(partner);
        });

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
        // @ts-ignore
        storage.findPartner(req.xUser.email).pipe(
            filter(isNotDynamodbError),
            map(partner => {
                partner.locations.push(location);
                return partner;
            }),
            switchMap(partner => forkJoin([
                storage.createPartner(partner),
                mappingStorage.createMapping(QrCodeMapping.fromLocation(
                    location,
                    partner.email,
                    true
                )),
                mappingStorage.createMapping(QrCodeMapping.fromLocation(
                    location,
                    partner.email,
                    false
                ))
            ])),
        ).subscribe(([
            partner,
            qr1,
            qr2
        ]) => {
            log.info(partner);
            log.info(qr1);
            log.info(qr2);
            if (!(isNotDynamodbError(qr1) && isNotDynamodbError(qr2) && isNotDynamodbError(partner))) {
                res.status(500);
                res.json({partner, qr1, qr2});
            } else {
                res.json(partner);
            }
        });
    }
);

router.delete(
    '/:id/bar/:barId',
    (req, res) => {
        // @ts-ignore
        storage.findPartner(req.xUser.email).pipe(
            filter(isNotDynamodbError),
            map(partner => {
                let location = partner.locations.filter(l => l.locationId === req.params.barId)[0];
                location = Object.assign(
                    location,
                    {active: false}
                );
                partner.locations = [
                    ...partner.locations.filter(l => l.locationId !== req.params.barId),
                    location
                ];
                return {partner: partner, checkIn: location.checkInCode, checkOut: location.checkOutCode};
            }),
            switchMap(({partner, checkIn, checkOut}) => forkJoin([
                mappingStorage.deleteMapping(checkIn),
                mappingStorage.deleteMapping(checkOut),
                storage.createPartner(partner)
            ]))
        ).subscribe(([
            qr1,
            qr2,
            partner
        ]) => {
            if (!(isNotDynamodbError<Partial<QrCodeMapping>>(qr1) && isNotDynamodbError<Partial<QrCodeMapping>>(qr2) && isNotDynamodbError(partner))) {
                res.status(500);
                log.error({
                    partner, qr1, qr2
                });
                res.json({partner, qr1, qr2});
            } else {
                res.json(partner);
            }
        });
    }
);

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


