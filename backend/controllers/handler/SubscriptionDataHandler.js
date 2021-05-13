'use strict';
const logger = require('../../utils/logger')
const requestManager = require('../utils/RequestManager')

/**
 * @returns a promise resolved with the device subscription info (SubscriptionData components in /api/openapi.yaml) or rejected with an error
 */
module.exports.getDeviceSubscriptionInfo = (ueID) => {
    logger.info(`Obtaining subscription info for device ID: ${ueID}`);
    return requestManager.makeARequest('GET', `${process.env.DIGITAL_ENTITY_5GS}/subscription/${ueID}`, data => data)
}
