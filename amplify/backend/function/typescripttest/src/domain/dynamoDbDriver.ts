import {Observable} from 'rxjs';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});


export interface GetItemParams {
    TableName: string,
    Key: Record<string, string>
}

export interface PutItemParams<T> {
    TableName: string,
    Item: T
}

export interface QueryItemParams {
    TableName: string,
    ExpressionAttributeValues: Record<string, string>,
    KeyConditionExpression: string,
    ProjectionExpression?: string,
    Limit?: number,
    ScanIndexForward?: boolean,
    ExclusiveStartKey?: any

}

export interface ScanItemParams {
    TableName: string,
    ExclusiveStartKey?: any,
    Limit?: number

}

export interface UpdateItemParams {
    TableName: string,
    Key: Record<string, any>,
    UpdateExpression: string,
    ExpressionAttributeValues: Record<string, any>,
    ReturnValues?: string

}

export type ItemParams<T> = UpdateItemParams | ScanItemParams | QueryItemParams | PutItemParams<T> | GetItemParams

export interface DynamodbError<T> {
    Error: any,
    itemParams: ItemParams<T>
}

export function isNotDynamodbError<T>(value: DynamodbError<T> | T): value is T {
    return !(<DynamodbError<T>>value)?.Error !== undefined;
}

export class Page<T> {

    public Data;
    public Limit;
    public Count;
    public ScannedCount;
    public LastEvaluatedKey;

    public static pageBuilder = (data: any, itemParams: ScanItemParams | QueryItemParams) => {
        return new Page(
            data.Items,
            itemParams.Limit,
            data.Count,
            data.ScannedCount,
            data.LastEvaluatedKey
        );
    };

    constructor(Data, Limit, Count, ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data;
        this.Limit = Limit;
        this.Count = Count;
        this.ScannedCount = ScannedCount;
        this.LastEvaluatedKey = LastEvaluatedKey;

    }
}

export class DbConnection<T> {

    readonly tableName: string;
    readonly partitionKey: string;
    readonly sortKey: string;


    private dynamodb = new AWS.DynamoDB.DocumentClient();

    constructor(
        tableName: string,
        partitionKey: string,
        sortKey?: string,
        defaultEnv: string = 'dev'
    ) {
        if (process.env.ENV && process.env.ENV !== 'NONE') {
            tableName = tableName + '-' + process.env.ENV;
        } else if (process.env.ENV === undefined) {
            tableName = tableName + '-' + defaultEnv;
        }
        this.tableName = tableName;
        this.partitionKey = partitionKey;
        this.sortKey = sortKey;
    }

    public findById(partitionKey: any, sortKey?: any): Observable<T | DynamodbError<T>> {
        return this.getEntity(
            {
                TableName: this.tableName,
                Key: {
                    [this.partitionKey]: partitionKey,
                    [this.sortKey]: sortKey
                }
            }
        );
    }

    public queryItems(optional: Partial<QueryItemParams>): Observable<Page<T> | DynamodbError<T>> {
        return this.queryEntities(<QueryItemParams>Object.assign(
            {
                TableName: this.tableName
            },
            optional
        ));
    }

    public putItem(item: T): Observable<Partial<T> | DynamodbError<T>> {
        return this.putEntity({
            TableName: this.tableName,
            Item: item
        });
    }

    public scanItems(optional: Partial<ScanItemParams>): Observable<Page<T> | DynamodbError<T>> {
        return this.scanEntities(<ScanItemParams>Object.assign(
            {
                TableName: this.tableName
            },
            optional
        ));
    }

    public updateItem(optional: Partial<UpdateItemParams>): Observable<Partial<T> | DynamodbError<T>> {
        return this.updateEntity(<UpdateItemParams>Object.assign(
            {
                TableName: this.tableName,
            },
            optional
        ));
    }

    public deleteItem(partitionKey: any, sortKey?: any): Observable<Partial<T> | DynamodbError<T>> {
        return this.deleteEntity(
            {
                TableName: this.tableName,
                Key: {
                    [this.partitionKey]: partitionKey,
                    [this.sortKey]: sortKey
                }
            });
    }

    private updateEntity(updateItemParams: UpdateItemParams): Observable<Partial<T> | DynamodbError<T>> {
        return new Observable<Partial<T> | DynamodbError<T>>(subscriber => {
            this.dynamodb.update(
                updateItemParams,
                ((err, data) => {
                    if (err) {
                        subscriber.next(<DynamodbError<T>>{
                            Error: err,
                            itemParams: updateItemParams
                        });
                    } else {
                        subscriber.next(data.Attributes);
                        subscriber.complete();
                    }
                })
            );
        });
    }

    private deleteEntity(deleteItemParams: any): Observable<Partial<T> | DynamodbError<T>> {
        return new Observable<Partial<T> | DynamodbError<T>>(subscriber => {
            this.dynamodb.delete(
                deleteItemParams,
                (((err, data) => {
                    if (err) {
                        subscriber.next(<DynamodbError<T>>{
                            Error: err,
                            itemParams: deleteItemParams
                        });
                    } else {
                        subscriber.next(deleteItemParams);
                        subscriber.complete();
                    }
                }))
            );
        });
    }

    private putEntity(putItemParams: PutItemParams<T>): Observable<Partial<T> | DynamodbError<T>> {
        return new Observable<Partial<T> | DynamodbError<T>>(subscriber => {
            this.dynamodb.put(
                putItemParams,
                (err, data) => {
                    if (err) {
                        subscriber.next(<DynamodbError<T>>{
                            Error: err,
                            itemParams: putItemParams
                        });
                    } else {
                        subscriber.next(putItemParams.Item);
                        subscriber.complete();
                    }
                }
            );
        });
    }

    private scanEntities(scanItemParams: ScanItemParams): Observable<Page<T> | DynamodbError<T>> {
        return new Observable<Page<T> | DynamodbError<T>>(subscriber => {
            this.dynamodb.scan(
                scanItemParams,
                (err, data) => {
                    if (err) {
                        subscriber.next(<DynamodbError<T>>{
                            Error: err,
                            itemParams: scanItemParams
                        });
                    } else {
                        subscriber.next(Page.pageBuilder(
                            data,
                            scanItemParams
                        ));
                    }
                    subscriber.complete();
                }
            );
        });
    }

    private queryEntities(queryItemParams: QueryItemParams): Observable<Page<T> | DynamodbError<T>> {
        return new Observable<Page<T> | DynamodbError<T>>(subscriber => {
            this.dynamodb.query(
                queryItemParams,
                (err, data) => {
                    if (err) {
                        subscriber.next(<DynamodbError<T>>{
                            Error: err,
                            itemParams: queryItemParams
                        });
                    } else {
                        subscriber.next(Page.pageBuilder(
                            data,
                            queryItemParams
                        ));
                    }
                    subscriber.complete();
                }
            );
        });
    }

    private getEntity(getItemParams: GetItemParams): Observable<T | DynamodbError<T>> {
        return new Observable(subscriber => {
                this.dynamodb.get(
                    getItemParams,
                    (err, data: any) => {
                        if (err) {
                            subscriber.next(<DynamodbError<T>>{
                                Error: err,
                                itemParams: getItemParams
                            });
                        } else {
                            subscriber.next(data.Item);
                        }
                        subscriber.complete();
                    }
                );
            }
        );
    }
}
