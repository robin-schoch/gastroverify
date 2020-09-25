import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Location} from '../domain/partner';
import {Observable} from 'rxjs';
import {Page} from '../domain/page';
import * as moment from 'moment';


export class locationStorage {

  private readonly dbConnection: DbConnection<Location>;

  constructor() {

    this.dbConnection = new DbConnection<Location>(
        'Location',
        'partnerId',
        'locationId'
    );
  }

  public findLocation(email: string, locationId: string): Observable<Location | DynamodbError<Location>> {
    return this.dbConnection.findById(email, locationId);
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
      UpdateExpression: 'set active = :active, remove ttl',
      ExpressionAttributeValues: {
        ':active': active,
      },
    };
    const add = {
      UpdateExpression: 'set active = :active, set ttl = :ttl',
      ExpressionAttributeValues: {
        ':active': active,
        ':ttl': moment().add(40, 'days').unix()
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
    return this.dbConnection.updateItem(param);
  }


  public createLocation(partner: Location): Observable<Partial<Location> | DynamodbError<Location>> {
    return this.dbConnection.putItem(partner);
  }


}
