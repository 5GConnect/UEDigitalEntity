'use strict';

require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? './.env-dev' : './.env-prod' })
var path = require('path');
var http = require('http');
const ws = require('ws');
const updateController = require("./controllers/PeriodicUpdate")
var cors = require('cors')

const logger = require('./utils/logger');
var serverPort = process.env.PORT;
var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var express = require('express');


global.logger = require('./utils/logger');

// swaggerRouter configuration
var options = {
    loglevel: 'info',
    controllers: path.join(__dirname, './controllers')
};
oasTools.configure(options)
var spec = fs.readFileSync(path.join(__dirname, './api/openapi.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);
var app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors())
}
app.use(express.json())

oasTools.initialize(oasDoc, app, function() {
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
});
