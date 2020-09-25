const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "visitor-index", src: true});


export const handler = (event, context) => {
    log.info(event)
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
