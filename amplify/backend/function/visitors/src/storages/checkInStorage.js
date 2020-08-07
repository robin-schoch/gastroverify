const AWS = require('aws-sdk')
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'})
const dynamodb = new AWS.DynamoDB.DocumentClient();
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
const sortKeyName = "EntryTime";


const insertCheckInData = (item) => {
  let putItemParams = {
    TableName: tableName,
    Item: item
  }
  console.log(putItemParams)
  // return new Promise(((resolve, reject) => resolve(putItemParams)))
  return new Promise((resolve, reject) => {
    dynamodb.put(putItemParams, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log(item)
        resolve(putItemParams.Item)
      }
    });
  })
}

module.exports.addCheckIn = (checkIn) => {
  return insertCheckInData(Object.assign({}, checkIn, {}))
}