'use strict';
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const logger = require('../utils/logger');

module.exports.getGnbConnectionState = function getUEConnectionState(req, res, next) {
    deviceInfoHandler.getGnbConnectionStatus()
        .then(result => {
            logger.debug(`Sending response: ${JSON.stringify(result)}`);
            res.status(200).send(result)
        })
        .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};

module.exports.createPDUSession = function createPDUSession(req, res, next) {
    let selected_session = req.body
    deviceInfoHandler.establishPduSession(selected_session)
        .then(result => {
            logger.debug(`Sending response: ${JSON.stringify(result)}`);
            res.status(200).send(result)
        })
        .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};

module.exports.getUEPDUSessions = function getUEPDUSessions(req, res, next) {
    deviceInfoHandler.getPduSessions()
        .then(result => {
            logger.debug(`Sending response: ${JSON.stringify(result)}`);
            res.status(200).send(result)
        })
        .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};