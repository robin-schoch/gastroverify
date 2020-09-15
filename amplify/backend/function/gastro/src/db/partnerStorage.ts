import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Partner} from '../domain/partner';
import {Observable} from 'rxjs';
import * as moment from 'moment';


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

    public hidePartner(email: string, hide = true): Observable<Partial<Partner> | DynamodbError<Partial<Partner>>> {
        return this.dbConnection.updateItem({
            Key: {
                [this.dbConnection.partitionKey]: email,
            },
            UpdateExpression: 'set hidden = :hidden',
            ExpressionAttributeValues: {
                ':hidden': hide,
            },
            ReturnValues: 'UPDATED_NEW'
        }
    )
    }

    public createPartner(partner: Partner): Observable<Partial<Partner> | DynamodbError<Partner>> {
        return this.dbConnection.putItem(partner);
    }


}
