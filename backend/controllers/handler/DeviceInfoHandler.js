'use strict';
const logger = require('../../utils/logger')
const requestManager = require('../utils/RequestManager')

/**
 * @returns a promise resolved with the device supi (imsi) or rejected with an error
 */
module.exports.getDeviceId = () => {
    logger.info("Obtaining device ID");
    return requestManager.makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/device-id`, data => data)
}

/**
 * @returns a promise resolved with the device status (connection status and possibly the gNB id) or rejected with an error
 */
module.exports.getGnbConnectionStatus = () => {
    logger.info("Obtaining device status");
    return requestManager.makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/gnb-connection-state`, data => data)
}

/**
 * @returns a promise resolved with the info of the new established PDU session or rejected with an error
 */
module.exports.establishPduSession = (sst, sd, dnn, pduSessionType) => {
    logger.info("Requesting PDU Session creation");
    return requestManager.makeARequest('POST', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/pdu-session?selected_session[sst]=${sst}&selected_session[sd]=${sd}&selected_session[dnn]=${dnn}&selected_session[pduSessionType]=${pduSessionType}`, data => data)
}
