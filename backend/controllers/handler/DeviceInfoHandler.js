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
module.exports.establishPduSession = (selected_session) => {
    logger.info("Requesting PDU Session creation");
    return requestManager.makeARequestWithBodyData('POST', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/pdu-session`, selected_session, data => data)
}

module.exports.getPduSessions = () => {
    logger.info("Obtaining established PDU Sessions");
    return requestManager.makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/pdu-session`, data => data)
}