"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
const moment = require("moment");
class locationStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Location', 'partnerId', 'locationId');
    }
    findLocation(email, locationId) {
        return this.dbConnection.findById(email, locationId);
    }
    findLocations(email, pageSize = 40, LastEvaluatedKey = null) {
        const queryParams = {
            ExpressionAttributeValues: {
                ':email': email,
            },
            KeyConditionExpression: `${this.dbConnection.partitionKey} = :email`,
            Limit: pageSize,
            ExclusiveStartKey: LastEvaluatedKey,
        };
        return this.dbConnection.queryItems(queryParams);
    }
    changeActivateLocation(email, locationId, active) {
        const remove = {
            UpdateExpression: 'set active = :active REMOVE timeToLive',
            ExpressionAttributeValues: {
                ':active': active,
            },
        };
        const add = {
            UpdateExpression: 'set active = :active, timeToLive=:timeToLive',
            ExpressionAttributeValues: {
                ':active': active,
                ':timeToLive': moment().add(40, 'days').unix()
            },
        };
        const updateParams = {
            Key: {
                [this.dbConnection.partitionKey]: email,
                [this.dbConnection.sortKey]: locationId
            },
            ReturnValues: 'ALL_NEW'
        };
        const param = Object.assign({}, updateParams, active ? remove : add);
        console.log(param);
        return this.dbConnection.updateItem(param);
    }
    createLocation(partner) {
        return this.dbConnection.putItem(partner);
    }
}
exports.locationStorage = locationStorage;
