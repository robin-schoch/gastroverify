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

const queryEntries = (queryParams) => {

    return new Promise((resolve, reject) => {
        console.log("i am called too")
        dynamodb.query(queryParams, (err, data) => {
            console.log("i am called too too")
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

const query = (queryParams) => {
    console.log(queryParams)
    return new Promise((resolve, reject) => {
        console.log("i am called too")
        dynamodb.query(queryParams, (err, data) => {
            console.log("i am called too too")
            if (err) {
                reject(err)
            } else {
                resolve({value: data.Items, lastEvaluatedKey: data.LastEvaluatedKey})
            }
        })
    })
}

const getEntries = (id, creationtime, pageSize, LastEvaluatedKey) => {
    console.log("i am called")
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
    console.log(a)
    return a
}

module.exports = {
    getEntries
}
