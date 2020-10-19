const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "partner-index", src: true});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    log.info(event)
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
