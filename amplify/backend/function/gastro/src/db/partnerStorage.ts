import {DbConnection, DynamodbError, isNotDynamodbError} from '../util/dynamoDbDriver';
import {Partner} from '../domain/partner';
import {Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';


export class partnerStorage {

    private readonly dbConnection: DbConnection<Partner>;

    constructor() {

        this.dbConnection = new DbConnection<Partner>(
            'Partner',
            'email'
        );
    }

    public findPartner(email: string): Observable<Partner | DynamodbError<Partner>> {
        return this.dbConnection.findById(email)
    }

    public createPartner(partner: Partner): Observable<Partial<Partner> | DynamodbError<Partner>> {
        return this.dbConnection.putItem(partner);
    }


}
