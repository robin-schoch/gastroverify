const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();

const moment = require('moment');


// add dev if local
let tableName = 'Entrance';

if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
  tableName = tableName + '-dev';
}
const partitionKeyName = 'locationId';
const sortkeyName = 'entryTime';

const query = (queryParams) => {
  console.log(queryParams);

};

export const getEntries = (id, creationtime, pageSize, LastEvaluatedKey) => {
  console.log(creationtime.toISOString())

  // ${sortkeyName} BETWEEN :from and :to
  const queryParams = {
    ExpressionAttributeValues: {
      ':location': id,
      ':from': creationtime.clone().subtract(24, 'hours').toISOString(),
      ':to': creationtime.toISOString(),
      ':start': '+0000000'
    },
    KeyConditionExpression: `${partitionKeyName} = :location and ${sortkeyName} BETWEEN :from and :to`,
    FilterExpression: 'not begins_with(phoneNumber, :start)',
    ProjectionExpression: 'phoneNumber',
    Limit: pageSize,
    ScanIndexForward: false,
    ExclusiveStartKey: LastEvaluatedKey,
    TableName: tableName
  };
  return new Promise((resolve, reject) => {
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({value: data.Items, lastEvaluatedKey: data.LastEvaluatedKey});
      }
    });
  });
};

