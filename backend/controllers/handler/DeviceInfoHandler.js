'use strict';
const logger = require('../../utils/logger')
const requestManager = require('../utils/RequestManager')

/**
 * @returns a promise resolved with the device supi (imsi) or rejected with an error
 */
module.exports.getDeviceId = () => {
    logger.info("Obtaining device ID");
    return requestManager.makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/deviceId`, data => data)
}

/**
 * @returns a promise resolved with the device status (connection status and possibly the gNB id) or rejected with an error
 */
module.exports.getDeviceStatus = () => {
    logger.info("Obtaining device status");
    return requestManager.makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/deviceStatus`, data => data)
}
