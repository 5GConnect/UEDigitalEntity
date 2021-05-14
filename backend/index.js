'use strict';

require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? './.env-dev' : './.env-prod' })
var path = require('path');
var http = require('http');
const ws = require('ws');
const updateController = require("./controllers/PeriodicUpdate")

var oas3Tools = require('oas3-tools');
const logger = require('./utils/logger');
var serverPort = process.env.PORT;

global.logger = require('./utils/logger');

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
let server = http.createServer(app).listen(serverPort, function() {
    logger.info(`Your server is listening on port ${serverPort}`);
});

const wss = new ws.Server({ server: server });
module.exports = wss;
wss.on('connection', (ws) => {
    logger.info('Client connected');
    updateController.startPolling();
    ws.on('close', () => {
        logger.info('Client disconnected')
        if (wss.clients.size === 0) {
            /*
             * To save resources, the polling cycle to maintain the device status updated
             * is stopped when there are no connected dashboards
             */
            updateController.stopPolling();
        }
    });
});
