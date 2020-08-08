const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const {Page} = require('./../domain/page')

const moment = require('moment');


// add dev if local
let tableName = "entry";
console.log(process.env.ENV)
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
    tableName = tableName + '-dev'
}
const partitionKeyName = "BarId";
const sortkeyName = "EntryTime";

const query = (queryParams) => {
    return new Promise((resolve, reject) => {
        dynamodb.query(queryParams, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(new Page(data.Items, data.Count, data.LastEvaluatedKey))
            }
        })
    })
}

const getEntries = (id, pageSize, LastEvaluatedKey) => {
    console.log(tableName)
    const queryParams = {
        ExpressionAttributeValues: {
            ':bar': id,
            ':entry': moment().subtract(14, 'days').toISOString(),
        },
        KeyConditionExpression: `${partitionKeyName} = :bar and ${sortkeyName} >= :entry`,
        ProjectionExpression: 'FirstName, LastName, Street, City, Zipcode, Email, PhoneNumber, EntryTime',
        Limit: pageSize,
        LastEvaluatedKey: LastEvaluatedKey,
        TableName: tableName
    };
    return query(queryParams)
}


module.exports = {
    getEntries
}
