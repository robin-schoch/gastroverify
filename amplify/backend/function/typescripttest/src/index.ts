/* Amplify Params - DO NOT EDIT
 ENV
 FUNCTION_SENDBILL_NAME
 REGION
 STORAGE_LOCATION_ARN
 STORAGE_LOCATION_NAME
 STORAGE_PARTNER_ARN
 STORAGE_PARTNER_NAME
 STORAGE_QRMAPPING_ARN
 STORAGE_QRMAPPING_NAME
 Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});
const lambda = new AWS.Lambda();

export const handler = async (event, context) => {
      console.log(process.env.FUNCTION_SENDBILL_NAME);
      const params = {
        FunctionName: process.env.FUNCTION_SENDBILL_NAME, // the lambda function we are going to invoke
        InvocationType: 'Event',
        LogType: 'Tail',
        Payload: '{ "name" : "Alex" }'
      };

      lambda.invoke(params, function (err, data) {
        if (err) {
          context.fail(err);
        } else {
          context.succeed('Lambda_B said ' + data.Payload);
        }
      });

      return {
        statusCode: 200,
        body: {}
      };

// const res = await dbConnection.findById('0ae17e6b-64dc-4e97-8fc5-0823767fae36').toPromise();

    }
;
