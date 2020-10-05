"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnection = exports.Page = exports.isNotDynamodbError = void 0;
const rxjs_1 = require("rxjs");
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION || 'eu-central-1' });
function isNotDynamodbError(value) {
    var _a;
    return !((_a = value) === null || _a === void 0 ? void 0 : _a.Error) !== undefined;
}
exports.isNotDynamodbError = isNotDynamodbError;
class Page {
    constructor(Data, Limit, Count, ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data;
        this.Limit = Limit;
        this.Count = Count;
        this.ScannedCount = ScannedCount;
        this.LastEvaluatedKey = LastEvaluatedKey;
    }
}
exports.Page = Page;
Page.pageBuilder = (data, itemParams) => {
    return new Page(data.Items, itemParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey);
};
class DbConnection {
    constructor(tableName, partitionKey, sortKey, defaultEnv = 'dev') {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
        if (process.env.ENV && process.env.ENV !== 'NONE') {
            tableName = tableName + '-' + process.env.ENV;
        }
        else if (process.env.ENV === undefined) {
            tableName = tableName + '-' + defaultEnv;
        }
        this.tableName = tableName;
        this.partitionKey = partitionKey;
        this.sortKey = sortKey;
    }
    findById(partitionKey, sortKey) {
        return this.getEntity({
            TableName: this.tableName,
            Key: {
                [this.partitionKey]: partitionKey,
                [this.sortKey]: sortKey
            }
        });
    }
    queryItems(optional) {
        return this.queryEntities(Object.assign({
            TableName: this.tableName
        }, optional));
    }
    putItem(item) {
        return this.putEntity({
            TableName: this.tableName,
            Item: item
        });
    }
    scanItems(optional) {
        return this.scanEntities(Object.assign({
            TableName: this.tableName
        }, optional));
    }
    updateItem(optional) {
        return this.updateEntity(Object.assign({
            TableName: this.tableName,
        }, optional));
    }
    deleteItem(partitionKey, sortKey) {
        return this.deleteEntity({
            TableName: this.tableName,
            Key: {
                [this.partitionKey]: partitionKey,
                [this.sortKey]: sortKey
            }
        });
    }
    updateEntity(updateItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.update(updateItemParams, ((err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: updateItemParams
                    });
                }
                else {
                    subscriber.next(data.Attributes);
                    subscriber.complete();
                }
            }));
        });
    }
    deleteEntity(deleteItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.delete(deleteItemParams, (((err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: deleteItemParams
                    });
                }
                else {
                    subscriber.next(deleteItemParams);
                    subscriber.complete();
                }
            })));
        });
    }
    putEntity(putItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.put(putItemParams, (err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: putItemParams
                    });
                }
                else {
                    subscriber.next(putItemParams.Item);
                    subscriber.complete();
                }
            });
        });
    }
    scanEntities(scanItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.scan(scanItemParams, (err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: scanItemParams
                    });
                }
                else {
                    subscriber.next(Page.pageBuilder(data, scanItemParams));
                }
                subscriber.complete();
            });
        });
    }
    queryEntities(queryItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.query(queryItemParams, (err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: queryItemParams
                    });
                }
                else {
                    subscriber.next(Page.pageBuilder(data, queryItemParams));
                }
                subscriber.complete();
            });
        });
    }
    getEntity(getItemParams) {
        return new rxjs_1.Observable(subscriber => {
            this.dynamodb.get(getItemParams, (err, data) => {
                if (err) {
                    subscriber.next({
                        Error: err,
                        itemParams: getItemParams
                    });
                }
                else {
                    subscriber.next(data.Item);
                }
                subscriber.complete();
            });
        });
    }
}
exports.DbConnection = DbConnection;
