import {DbConnection, DynamodbError} from '../util/dynamoDbDriver';
import {createLogger} from 'bunyan';

import {Observable} from 'rxjs';
import {QrCodeMapping} from '../domain/qrCodeMapping';


const util = require('util');
const log = createLogger({name: 'qrCodeMappingStorage', src: true});

export class QrCodeMappingStorage {
    private readonly dbConnection: DbConnection<QrCodeMapping>;

    constructor() {

        this.dbConnection = new DbConnection<QrCodeMapping>(
            'QRMapping',
            'qrId'
        );
    }

    public findMapping(qrId: string): Observable<QrCodeMapping | DynamodbError<QrCodeMapping>> {
        return this.dbConnection.findById(qrId).pipe();
    }

    public deleteMapping(qrId: string): Observable<Partial<QrCodeMapping> | DynamodbError<QrCodeMappingStorage>> {
        return this.dbConnection.deleteItem(qrId);
    }

    public createMapping(qrCodeMapping: QrCodeMapping): Observable<Partial<QrCodeMapping> | DynamodbError<QrCodeMapping>> {
        return this.dbConnection.putItem(qrCodeMapping);
    }
}


