import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {Partner, Location} from '../domain/partner';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {Page} from '../domain/page';


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

    public findLocations(email:string, pageSize = 40, LastEvaluatedKey = null): Observable<Page<Location> | DynamodbError<Location>> {
        const queryParams = {
            ExpressionAttributeValues: {
                ':email': email,
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :email`,
            Limit: pageSize,
            ExclusiveStartKey: LastEvaluatedKey,
        };
        return this.dbConnection.queryItems(queryParams)
    }

    public changeActivateLocation(email: string, locationId: string, active ): Observable<Partial<Location> | DynamodbError<Location>> {
        const updateParams = {
            Key: {
                [this.dbConnection.partitionKey]: email,
                [this.dbConnection.sortKey]: locationId
            },
            UpdateExpression: 'set active = :active',
            ExpressionAttributeValues: {
                ':active': active,
            },
            ReturnValues: 'ALL_NEW'
        };
        return this.dbConnection.updateItem(updateParams)
    }


    public createLocation(partner: Location): Observable<Partial<Location> | DynamodbError<Location>> {
        return this.dbConnection.putItem(partner);
    }


}