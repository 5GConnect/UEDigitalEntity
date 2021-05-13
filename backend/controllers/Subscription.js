'use strict';
const subscriptionHandler = require('./handler/SubscriptionDataHandler')
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const logger = require('../utils/logger')

module.exports.getUESubscriptionInfo = function getUESubscriptionInfo(req, res, next) {
    deviceInfoHandler.getDeviceId().then(deviceId => {
        subscriptionHandler.getDeviceSubscriptionInfo(deviceId)
            .then(subscriptionData => {
                logger.verbose(`Sending response: ${JSON.stringify(subscriptionData)}`);
                res.status(200).send(subscriptionData)
            })
            .catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
    }).catch(errorObject => errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message))
};
