"use strict";
/* Amplify Params - DO NOT EDIT
 ENV
 REGION
 STORAGE_MONTHLYREPORT_ARN
 STORAGE_MONTHLYREPORT_NAME
 Amplify Params - DO NOT EDIT */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
//import {iamTheLayer} from '../../utility/opt/test';
exports.handler = async (event) => {
    //iamTheLayer();
    const response = {
        statusCode: 200,
        //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*"
        //  },
        body: JSON.stringify(event),
    };
    return response;
};
