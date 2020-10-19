import {DbConnection, DynamodbError, isNotDynamodbError} from '../util/dynamoDbDriver';
import {Location} from '../domain/partner';
import {Observable, of, throwError} from 'rxjs';
import {Page} from '../domain/page';
import * as moment from 'moment';
import {switchMap} from 'rxjs/operators';


export class locationStorage {

  private readonly dbConnection: DbConnection<Location>;

  constructor() {

    this.dbConnection = new DbConnection<Location>(
        'Location',
        'partnerId',
        'locationId'
    );
  }

  public findLocation(email: string, locationId: string): Observable<Location> {
    return this.dbConnection.findById(email, locationId)
               .pipe(switchMap(a => isNotDynamodbError<Location>(a) ?
                                    of(a) :
                                    throwError(a)));
  }

  public findLocations(email: string, pageSize = 40, LastEvaluatedKey = null): Observable<Page<Location> | DynamodbError<Location>> {
    const queryParams = {
      ExpressionAttributeValues: {
        ':email': email,
      },
      KeyConditionExpression: `${this.dbConnection.partitionKey} = :email`,
      Limit: pageSize,
      ExclusiveStartKey: LastEvaluatedKey,
    };
    return this.dbConnection.queryItems(queryParams);
  }

  public changeActivateLocation(email: string, locationId: string, active): Observable<Partial<Location> | DynamodbError<Location>> {
    const remove = {
      UpdateExpression: 'set active = :active REMOVE timeToLive',
      ExpressionAttributeValues: {
        ':active': active,
      },
    };
    const add = {
      UpdateExpression: 'set active = :active, timeToLive=:timeToLive',
      ExpressionAttributeValues: {
        ':active': active,
        ':timeToLive': moment().add(40, 'days').unix()
      },
    };
    const updateParams = {
      Key: {
        [this.dbConnection.partitionKey]: email,
        [this.dbConnection.sortKey]: locationId
      },
      ReturnValues: 'ALL_NEW'
    };
    const param = Object.assign({}, updateParams, active ? remove : add);
    console.log(param);
    return this.dbConnection.updateItem(param);
  }

  public findAllLocation(): Observable<Page<Location>> {
    return this.dbConnection.scanItems({})
               .pipe(switchMap(a => isNotDynamodbError<Page<Location>>(a) ?
                                    of(a) :
                                    throwError(a)));
  }

  public createLocation(partner: Location): Observable<Partial<Location> | DynamodbError<Location>> {
    return this.dbConnection.putItem(partner);
  }


}
