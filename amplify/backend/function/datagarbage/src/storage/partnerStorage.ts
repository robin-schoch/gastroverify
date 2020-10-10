import {Observable} from 'rxjs';
import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Partner} from '../domain/partner';
import {tap} from 'rxjs/operators';

export class partnerStorage {

  private readonly dbConnection: DbConnection<Partner>;

  constructor() {

    this.dbConnection = new DbConnection<Partner>(
        'Partner',
        'email'
    );
  }

  public findPartner(email: string): Observable<Partner | DynamodbError<Partner>> {
    return this.dbConnection.findById(email);
  }

  public findPartnerPaged(limit = 100, lastKey = null) {
    return this.dbConnection.scanItems({
      Limit: limit,
      ExclusiveStartKey: lastKey
    });
  }

  public hidePartner(email: string, hide = true): Observable<Partial<Partner> | DynamodbError<Partial<Partner>>> {
    return this.dbConnection.updateItem({
          Key: {
            [this.dbConnection.partitionKey]: email,
          },
          UpdateExpression: 'set isHidden = :hideMe',
          ExpressionAttributeValues: {':hideMe': hide},
          ReturnValues: 'UPDATED_NEW'
        }
    );
  }

  public createPartner(partner: Partner): Observable<Partial<Partner> | DynamodbError<Partner>> {
    return this.dbConnection.putItem(partner);
  }

  public subtractReferral(partner: Partner): Observable<Partial<Partner | DynamodbError<Partner>>> {
    const updateParam = {
      Key: {
        [this.dbConnection.partitionKey]: partner.email,
      },
      ExpressionAttributeValues: {
        ':val': 1
      },
      UpdateExpression: 'SET referral = referral - :val',
      ReturnValues: 'UPDATED_NEW'
    };
    return this.dbConnection.updateItem(updateParam).pipe(tap(elem => console.log(elem)));
  }
}
