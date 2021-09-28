'use strict';
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const subscriptionHandler = require('./handler/SubscriptionDataHandler')
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

module.exports.deletePDUSession = function getUEPDUSessions(req, res, next) {
    let pdu_id = req.params.pduId
    deviceInfoHandler.releasePduSession(pdu_id)
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

module.exports.getPDUSessionByRequirement = function getPDUSessionByRequirement(req, res, next) {
    deviceInfoHandler.getDeviceId().then(deviceId => {
        subscriptionHandler.getDeviceSubscriptionInfo(deviceId)
            .then(subscriptionData => {
                let flattened_nssai = filterAndFlattenNssai(subscriptionData.nssai.defaultSingleNssais.concat(
                    subscriptionData.nssai.singleNssais
                ))
                switch (req.params.requirement) {
                    case 'HIGH_DOWNLINK_BANDWIDTH':
                        let maximum = flattened_nssai.reduce(function(precedent, current) {
                            let precedentDownlink = getBandwidthValueInKbp(precedent.sessionAmbrDownlink)
                            let currentDownlink = getBandwidthValueInKbp(current.sessionAmbrDownlink)
                            return precedentDownlink < currentDownlink ? current : precedent;
                        })
                        res.status(200).send({
                            "sst": maximum.sst,
                            "sd": maximum.sd,
                            "dnn": maximum.apn,
                            "pduSessionType": "IPV4"
                        })
                        break;
                    case 'LOW_DOWNLINK_BANDWIDTH':
                        let minimum = flattened_nssai.reduce(function(precedent, current) {
                            let precedentDownlink = getBandwidthValueInKbp(precedent.sessionAmbrDownlink)
                            let currentDownlink = getBandwidthValueInKbp(current.sessionAmbrDownlink)
                            return precedentDownlink < currentDownlink ? precedent : current;
                        })
                        res.status(200).send({
                            "sst": minimum.sst,
                            "sd": minimum.sd,
                            "dnn": minimum.apn,
                            "pduSessionType": "IPV4"
                        })
                        break;
                    default:
                        res.status(200).send({});
                        break;
                }
            })
            .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
    }).catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};

function filterAndFlattenDnnConfiguration(dnnConfigurationObject) {
    let res = [];
    for (const [key, value] of Object.entries(dnnConfigurationObject)) {
        let qosProfile = value["5gQosProfile"];
        res.push({
            apn: key,
            defaultPduSession: value.pduSessionTypes.defaultSessionType,
            "5qi": qosProfile["5qi"],
            arp: qosProfile.priorityLevel,
            capability: qosProfile.arp.preemptCap,
            vulnerability: qosProfile.arp.preemptVuln,
            sessionAmbrDownlink: value.sessionAmbr.downlink,
            sessionAmbrUplink: value.sessionAmbr.uplink,
        });
    }
    return res;
}

function filterAndFlattenNssai(nssaiList) {
    return nssaiList.flatMap((element) =>
        filterAndFlattenDnnConfiguration(element.dnnConfigurations).map(
            (filteredAndFlattenedDnnConfigurations) =>
            Object.assign({ sst: element.sst, sd: element.sd },
                filteredAndFlattenedDnnConfigurations
            )
        )
    );
}

function getBandwidthValueInKbp(valueAndUdm) {
    let splittedInformation = valueAndUdm.split(" ")
    let value = parseInt(splittedInformation[0])
    switch (splittedInformation[1].toLowerCase()) {
        case 'bps':
            return value / 1000
        case 'kbps':
            return value
        case 'mbps':
            return value * 1000
        case 'gbps':
            return value * Math.pow(1000, 2)
        case 'tbps':
            return value * Math.pow(1000, 3)
    }
}