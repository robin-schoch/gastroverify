const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "checkInStorage", src: true});

// add dev if local
let tableName = "Entrance";

if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
} else if (process.env.ENV === undefined) {
  tableName = tableName + '-dev'
}
const partitionKeyName = "locationId";
const sortKeyName = "entryTime";


const insertCheckInData = (item) => {
  let putItemParams = {
    TableName: tableName,
    Item: item
  }

  // return new Promise(((resolve, reject) => resolve(putItemParams)))
  return new Promise((resolve, reject) => {
    dynamodb.put(putItemParams, (err, data) => {
      if (err) {

        reject(err)
      } else {

        resolve(putItemParams.Item)
      }
    });
  })
}

module.exports.addCheckIn = (checkIn) => {
  return insertCheckInData(Object.assign({}, checkIn, {}))
}
