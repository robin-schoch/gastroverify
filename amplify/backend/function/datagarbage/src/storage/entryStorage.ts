const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


// add dev if local
let tableName = "Entrance";

if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "locationId";
const sortkeyName = "entryTime";

const query = (queryParams) => {

    return new Promise((resolve, reject) => {

        dynamodb.query(queryParams, (err, data) => {

            if (err) {
                reject(err)
            } else {
                resolve({value: data.Items, lastEvaluatedKey: data.LastEvaluatedKey})
            }
        })
    })
}

export const getEntries = (id, creationtime, pageSize, LastEvaluatedKey) => {

    const queryParams = {
        ExpressionAttributeValues: {
            ':location': id,
            ':entry': creationtime.subtract(24, 'hours').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} >= :entry`,
        ProjectionExpression: 'phoneNumber',
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: LastEvaluatedKey,
        TableName: tableName
    };
    let a = query(queryParams)

    return a
}


