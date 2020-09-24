import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Observable} from 'rxjs';
import {CheckIn} from '../domain/checkIn';

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'checkInStorage', src: true});

export class checkInStorage {
  private readonly dbConnection: DbConnection<CheckIn>;

  constructor() {

    this.dbConnection = new DbConnection<CheckIn>(
        'Entrance',
        'locationId',
        'entryTime'
    );
  }

  public findEntry(locationId: string, entryTime: string): Observable<CheckIn | DynamodbError<CheckIn>> {
    return this.dbConnection.findById(locationId, entryTime);
  }

  public createEntry(checkin: CheckIn): Observable<Partial<CheckIn> | DynamodbError<CheckIn>> {
    return this.dbConnection.putItem(checkin);
  }
}
