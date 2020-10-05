"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
class locationStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Location', 'partnerId', 'locationId');
    }
    findLocation(email, locationId) {
        return this.dbConnection.findById(email, locationId);
    }
    findLocations(email, pageSize = 100, LastEvaluatedKey = null) {
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
        return this.dbConnection.updateItem(updateParams);
    }
    createLocation(partner) {
        return this.dbConnection.putItem(partner);
    }
}
exports.locationStorage = locationStorage;
