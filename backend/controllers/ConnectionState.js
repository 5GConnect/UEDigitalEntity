'use strict';
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const pduSessionsModel = require('../models/PDUSessions')

module.exports.getGnbConnectionState = function getUEConnectionState(req, res, next) {
    return deviceInfoHandler.getGnbConnectionStatus()
        .then(result => {
            logger.verbose(`Sending response: ${JSON.stringify(result)}`);
            res.status(200).send(result)
        })
        .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};

module.exports.createPDUSession = function createPDUSession(req, res, next, selected_session) {
    return deviceInfoHandler.establishPduSession(selected_session.sst, selected_session.sd, selected_session.dnn, selected_session.pduSessionType)
        .then(result => {
            logger.verbose(`Sending response: ${JSON.stringify(result)}`);
            pduSessionsModel.addSession({
                sst: selected_session.sst,
                sd: selected_session.sd,
                dnn: selected_session.dnn,
                pduSessionType: selected_session.pduSessionType,
                ipAddress: result.address,
                emergency: result.emergency,
                id: result.id
            });
            res.status(200).send(result)
        })
        .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};

module.exports.getUEPDUSessions = function getUEPDUSessions(req, res, next) {
    res.status(200).json(pduSessionsModel.getSessions());
};
