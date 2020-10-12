/* Amplify Params - DO NOT EDIT
 ENV
 FUNCTION_SENDBILL_NAME
 REGION
 STORAGE_LOCATION_ARN
 STORAGE_LOCATION_NAME
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 STORAGE_QRMAPPING_ARN
 STORAGE_QRMAPPING_NAME
 Amplify Params - DO NOT EDIT */

import {map, switchMap} from 'rxjs/operators';
import {QrCodeMappingStorage} from './db/qrCodeMappingStorage';
import {locationStorage} from './db/locationStorage';
import {forkJoin} from 'rxjs';
import {QrCodeMapping} from './domain/qrCodeMapping';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const lambda = new AWS.Lambda();
export const handler = async (event, context) => {


  // migration for locations
  const storage = new QrCodeMappingStorage();
  const lstorage = new locationStorage();

  lstorage.findAllLocation().pipe(
      map(page => page.Data),
      switchMap(locations => forkJoin(
          locations.map(elem => {
            return forkJoin([
              storage.createMapping(QrCodeMapping.fromLocation(elem, elem.partnerId, true)),
              storage.createMapping(QrCodeMapping.fromLocation(elem, elem.partnerId, false))
            ]);
          })
          )
      )
  ).subscribe(elems => {
    console.log(elems);
  });


// const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();

};
