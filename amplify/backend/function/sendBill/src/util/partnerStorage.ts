import {DbConnection, DynamodbError} from './dynamoDbDriver';
import {Partner} from './partner';
import {Observable} from 'rxjs';


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

  public addReferral(partner: string) {
    const updateConfig = {
      Key: {
        [this.dbConnection.partitionKey]: partner,
      },
      ExpressionAttributeValues: {
        ':val': 1
      },
      UpdateExpression: 'SET referral = referral + :val'
    };
    return this.dbConnection.updateItem(updateConfig);
  }

  public removeReferral(partner: string) {
    const updateConfig = {
      Key: {
        [this.dbConnection.partitionKey]: partner,
      },
      ExpressionAttributeValues: {
        ':val': 1
      },
      UpdateExpression: 'SET referral = referral - :val'
    };
    return this.dbConnection.updateItem(updateConfig);
  }
}
