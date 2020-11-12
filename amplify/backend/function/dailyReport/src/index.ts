/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_DAILYREPORT_ARN
 STORAGE_DAILYREPORT_NAME
 STORAGE_ENTRANCE_ARN
 STORAGE_ENTRANCE_NAME
 STORAGE_LOCATION_ARN
 STORAGE_LOCATION_NAME
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 Amplify Params - DO NOT EDIT */

import {switchMap, tap} from 'rxjs/operators';
import {locationStorage} from './storage/locationStorage';
import {isNotDynamodbError} from './util/dynamoDbDriver';
import {of, throwError} from 'rxjs';
import {Page} from './domain/page';
import {partnerStorage} from './storage/partnerStorage';

const {scanPartner} = require('./storage/partnerStorage');

const {getEntries} = require('./storage/entryStorage');
const {createNewReport} = require('./storage/reportStorage');
const moment = require('moment');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'reportStorage', src: true});

const locationstorage = new locationStorage();
const partnerstorage = new partnerStorage();

const prices = {
  premium: 0.24,
  default: 0.12,
  nachtGallen: 0.12
};

const createReportForPartner = async (date, partner) => {
  const locations = await locationstorage.findLocations(partner.email).pipe(
      tap(a => log.info(a)),
      switchMap(a => isNotDynamodbError<Page<any>>(a) ? of(a.Data) : throwError(a)),
  ).toPromise().catch(err => log.error(err));
  return Promise.all(locations.map(location => createReportForLocation(
      date.clone(),
      location
  )));
};

const createReportForLocation = async (date, location) => {
  return new Promise(async (resolve, reject) => {
    log.info(location);
    let vals = [];
    let lastkey = null;
    do {

      let data = await getEntries(
          location.locationId,
          date.clone(),
          10000,
          lastkey
      ).catch(err => log.error(err));

      if (!!data.value) {
        vals = [
          ...data.value.map(elem => elem.phoneNumber),
          ...vals
        ];
        lastkey = data.lastEvaluatedKey ? data.lastEvaluatedKey : null;
      }
    } while (lastkey !== null);
    let count = new Set(vals).size;
    let totalCount = vals.length;
    let pricing = !!location.senderID ? prices.premium : prices.default;
    if (location.senderID === 'NachtGallen') pricing = prices.nachtGallen;
    await createNewReport(
        location.locationId,
        date.toISOString(),
        count,
        totalCount,
        pricing
    ).catch(err => log.error(err));
    resolve(true);
  });

};


exports.handler = async (event) => {


  const creationTime = moment().hours(6).minutes(0).seconds(0).milliseconds(0);


  log.info('create reports: ' + creationTime.toISOString());

  const dat = creationTime.clone();


  let lastEvaluatedPartnerKey = null;
  let partnerList = [];
  do {
    let partners = await partnerstorage.findPartnerPaged()
                                       .pipe(
                                           switchMap((a) => isNotDynamodbError<Page<any>>(a) ?
                                                            of(a) :
                                                            throwError(a)),
                                       ).toPromise().catch(err => log.error(err));
    // let partners = await scanPartner(lastEvaluatedPartnerKey).catch(err => log.error(err));
    lastEvaluatedPartnerKey = partners.LastEvaluatedKey ? partners.LastEvaluatedKey : null;
    partnerList = [
      ...partnerList,
      ...partners.Data.map(p => createReportForPartner(
          creationTime,
          p
      ))
    ];
  } while (!!lastEvaluatedPartnerKey);
  await Promise.all(partnerList);
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};


