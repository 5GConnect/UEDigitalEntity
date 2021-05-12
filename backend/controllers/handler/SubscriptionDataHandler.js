'use strict';
const axios = require('axios');
const errorHandler = require('./ErrorHandler')
const logger = require('../../utils/logger')

function makeARequest(method, requestPath, onSuccess) {
    return new Promise((resolve, reject) => {
        axios({
                method: method,
                url: requestPath,
            })
            .then(response => {
                resolve(onSuccess(response.data))
            })
            .catch(error => {
                reject(errorHandler.handleError(error))
            })
    });
}

module.exports.getDeviceId = () => {
    logger.info("Obtaining device ID");
    return makeARequest('GET', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/deviceId`, data => data)
}

module.exports.getDeviceSubscriptionInfo = (ueID) => {
    logger.info(`Obtaining subscription info for device ID: ${ueID}`);
    return makeARequest('GET', `${process.env.DIGITAL_ENTITY_5GS}/subscription/${ueID}`, data => data)
}
