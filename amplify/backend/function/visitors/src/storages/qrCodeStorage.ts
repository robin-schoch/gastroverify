import {DbConnection, DynamodbError, Page} from '../util/dynamoDbDriver';

import {Observable} from 'rxjs';
import {QrCodeMapping} from '../domain/qrCodeMapping';

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'qrCodeStorage', src: true});


export class qrCodeStorage {
    private readonly dbConnection: DbConnection<QrCodeMapping>;

    constructor() {

        this.dbConnection = new DbConnection<QrCodeMapping>(
            'QRMapping',
            'qrId'
        );
    }

    public findMapping(qrId: string): Observable<QrCodeMapping | DynamodbError<QrCodeMapping>> {
        return this.dbConnection.findById(qrId);
    }

}
