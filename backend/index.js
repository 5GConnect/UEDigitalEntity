'use strict';

var dotenv = require('dotenv')
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: './.env-dev' })
}

var path = require('path');
var http = require('http');
const ws = require('ws');
var cors = require('cors')

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
} else if (process.env.NODE_ENV === 'production') {
    app.use(cors({
        origin: "http://137.204.107.63:55000"
    }))
}
app.use(express.json())

oasTools.initialize(oasDoc, app, function() {
    // Initialize the Swagger middleware
    let server = http.createServer(app).listen(serverPort, function() {
        logger.info(`Your server is listening on port ${serverPort}`);
    });
    //const discoveryController = require("./controllers/DiscoveryService")
    //discoveryController.sendPeriodicalSignal();
    const wss = new ws.Server({ server: server });
    module.exports = wss;
    // wss.on('connection', (ws) => {
    //     logger.info('Client connected');
    //     const updateController = require("./controllers/PeriodicUpdate")
    //     updateController.startPolling();
    //     ws.on('close', () => {
    //         logger.info('Client disconnected')
    //         if (wss.clients.size === 0) {
    //             /*
    //              * To save resources, the polling cycle to maintain the device status updated
    //              * is stopped when there are no connected dashboards
    //              */
    //             updateController.stopPolling();
    //         }
    //     });
    // });
});
