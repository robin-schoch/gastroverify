const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


// add dev if local
let tableName = "Entrance";
console.log(process.env.ENV)
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
                console.log(err)
                reject(err)
            } else {
               // console.log(data)
                resolve({value: data.Items, lastEvaluatedKey: data.LastEvaluatedKey})
            }
        })
    })
}

const getEntries = (id, creationtime, pageSize, LastEvaluatedKey) => {
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
    return query(queryParams).catch(err => console.log(err))
}

module.exports = {
    getEntries
}
