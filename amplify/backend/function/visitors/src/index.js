const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "visitor-index", src: true});


exports.handler = (event, context) => {
    log.trace(event)
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
