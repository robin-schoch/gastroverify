import {DbConnection, DynamodbError, isNotDynamodbError, Page} from '../util/dynamoDbDriver';
import * as moment from 'moment';

import {createLogger} from 'bunyan';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {Entry} from '../domain/entry';
import {CheckIn} from '../domain/checkIn';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();


const log = createLogger({name: 'entryStorage', src: true});

// add dev if local
let tableName = 'Entrance';

if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
  tableName = tableName + '-dev';
}
const partitionKeyName = 'locationId';
const sortkeyName = 'entryTime';

const query = (queryParams) => {
  return new Promise((resolve, reject) => {
    dynamodb.query(
        queryParams,
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(new Page(
                data.Items,
                queryParams.Limit,
                data.Count,
                data.ScannedCount,
                data.LastEvaluatedKey
            ));
          }
        }
    );
  });
};

export const getEntries = (id, pageSize, LastEvaluatedKey) => {
  const queryParams = {
    ExpressionAttributeValues: {
      ':location': id,
      ':entry': moment().subtract(
          14,
          'days'
      ).toISOString(),
    },
    KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
    //ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn,
    // birthdate, tableNumber',
    Limit: pageSize,
    ScanIndexForward: false,
    ExclusiveStartKey: LastEvaluatedKey,
    TableName: tableName
  };
  return query(queryParams);
};


export class entryStorage {

  private readonly dbConnection: DbConnection<Entry>;

  constructor() {
    this.dbConnection = new DbConnection<Entry>(
        'Entrance',
        'locationId',
        'entryTime'
    );
  }

  public findPaged(id: string, pageSize: number, LastEvaluatedKey: any): Observable<Page<any> | DynamodbError<any>> {
    const queryParams = {
      ExpressionAttributeValues: {
        ':location': id,
        ':entry': moment().subtract(14, 'days').toISOString(),
      },
      KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} >= :entry`,
      ProjectionExpression: 'firstName, lastName, street, city, zipCode, email, phoneNumber, entryTime, checkIn, birthdate, tableNumber',
      Limit: pageSize,
      ScanIndexForward: false,
      ExclusiveStartKey: LastEvaluatedKey,
    };
    return this.dbConnection.queryItems(queryParams)
               .pipe(switchMap(b => isNotDynamodbError<any>(b) ?
                                    of(b) :
                                    throwError(b)));
  }

  public getQuarantine(id: string, timeOfEntry, firstName = null, lastName = null, phoneNumber = null): Observable<Entry[]> {
    return this.findPossibleCoronaSubject(id, timeOfEntry, firstName, lastName, phoneNumber).pipe(
        tap(elem => console.log(elem)),
        switchMap(subjects => {
              if (subjects.length < 1) return of([]);
              return forkJoin(subjects.map(subject => {
                    return this.findPossibleQuarantine(id, subject[0].entryTime,
                        !!subject[1] ?
                        subject[1].entryTime :
                        moment(timeOfEntry).endOf('day').add(5, 'hour').toISOString(),
                        subject[0].tableNumber);
                  }
              )).pipe(
                  tap(elem => console.log('we are at 112' + elem)),
                  map(elem => {
                    // elem.map(elem => elem);
                    const numberSet = new Set();
                    return [].concat(...elem).filter(elem => {
                      const unique = !numberSet.has(elem.phoneNumber);
                      numberSet.add(elem.phoneNumber);
                      return unique;
                    });
                  }));
            }
        )
    );
  }

  public findPossibleCoronaSubject(id: string, timeOfEntry: string, firstName = null, lastName = null, phoneNumber = null): Observable<[Entry, Entry][]> {
    console.log(moment(timeOfEntry).startOf('day').toISOString());
    console.log(moment(timeOfEntry).endOf('day').toISOString());
    console.log(moment(timeOfEntry).toISOString());
    const queryParams = {
      ExpressionAttributeValues: {
        ':location': id,
        ':entry': timeOfEntry
      },
      KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} >= :entry`,
      ScanIndexForward: true,
    };

    return this.dbConnection.queryItems(queryParams)
               .pipe(switchMap(b => isNotDynamodbError<Page<Entry>>(b) ?
                                    of(b.Data) :
                                    throwError(b)),
                   tap(found => log.info(found)),
                   map(entries => entries
                       .filter(entry => {
                         if (!!phoneNumber) {
                           log.info('phonenumber matched');
                           return entry.phoneNumber === phoneNumber;
                         }
                         if (!!lastName && !!firstName) {
                           log.info('name matched');
                           return entry.lastName === lastName && entry.firstName === firstName;
                         }
                         log.warn('No match');
                         return false;
                       })
                       .reduce((acc, entry) => {
                         switch (entry.checkIn) {
                           case true: {
                             if (acc.length === 0) return [[entry, null]];
                             if (!acc[acc.length - 1][1]) return acc;
                             if (!!acc[acc.length - 1][1]) return [...acc, [entry, null]];
                             break;
                           }
                           case false: {
                             if (acc.length === 0) return [[entry, null]];
                             acc[acc.length - 1][1] = entry;
                             return acc;
                           }
                           default:
                             return acc;
                         }
                       }, [])
                   )
               );
  }

  public findPossibleQuarantine(id: string, timeOfEntry: string, timeOfExit: string, table: number = -1): Observable<Entry[]> {
    const queryParams = {
      ExpressionAttributeValues: {
        ':location': id,
        ':entry': moment(timeOfEntry).startOf('day').toISOString()
      },
      KeyConditionExpression: `${this.dbConnection.partitionKey} = :location and ${this.dbConnection.sortKey} >= :entry`,

      ScanIndexForward: true,
    };
    const entryMoment = moment(timeOfEntry);
    const exitMoment = moment(timeOfExit);
    return this.dbConnection.queryItems(queryParams)
               .pipe(switchMap(b => isNotDynamodbError<Page<Entry>>(b) ?
                                    of(b.Data) :
                                    throwError(b)),
                   map(entries => {
                     const checkOutBefore = new Set([].concat(entries
                         .filter(entry => !entry.checkIn && moment(entry.entryTime).isBefore(timeOfEntry))
                         .map(entry => entries
                             .filter(e => e.phoneNumber === entry.phoneNumber && moment(e.entryTime).isBefore(moment(entry.entryTime))))
                     ).map(elem => this.convertToUniqueString(elem)));
                     const checkInAfter = new Set(entries.filter(entry => entry.checkIn && moment(entry.entryTime).isAfter(timeOfExit))
                                                         .map(elem => this.convertToUniqueString(elem)));
                     return entries.filter(entry => entry.checkIn)
                                   .filter(entry => table === -1 || entry.tableNumber === table)
                                   .filter(entry => !checkInAfter.has(this.convertToUniqueString(entry)) && !checkOutBefore.has(this.convertToUniqueString(entry)));
                   })
               );
  }

  private convertToUniqueString(entry: Entry): string {
    return entry.phoneNumber + entry.entryTime;
  }


  public createEntry(checkin: CheckIn): Observable<Partial<CheckIn> | DynamodbError<CheckIn>> {
    return this.dbConnection.putItem(checkin).pipe(switchMap(elem => isNotDynamodbError(elem) ?
                                                                     of(elem) :
                                                                     throwError(elem)));
  }

}

