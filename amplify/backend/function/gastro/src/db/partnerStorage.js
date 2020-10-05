"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnerStorage = void 0;
const dynamoDbDriver_1 = require("../util/dynamoDbDriver");
class partnerStorage {
    constructor() {
        this.dbConnection = new dynamoDbDriver_1.DbConnection('Partner', 'email');
    }
    findPartner(email) {
        return this.dbConnection.findById(email);
    }
    findPartnerPaged(limit = 100, lastKey = null) {
        return this.dbConnection.scanItems({
            Limit: limit,
            ExclusiveStartKey: lastKey
        });
    }
    hidePartner(email, hide = true) {
        return this.dbConnection.updateItem({
            Key: {
                [this.dbConnection.partitionKey]: email,
            },
            UpdateExpression: 'set isHidden = :hideMe',
            ExpressionAttributeValues: { ':hideMe': hide },
            ReturnValues: 'UPDATED_NEW'
        });
    }
    createPartner(partner) {
        return this.dbConnection.putItem(partner);
    }
}
exports.partnerStorage = partnerStorage;
