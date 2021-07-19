'use strict';
const logger = require('../utils/logger')
const requestManager = require('./utils/RequestManager')

module.exports.executeping = function executeping(req, res, next) {
    logger.info("Trigger ping execution");
    requestManager.makeARequestWithBodyData('POST', `${process.env.PHYSICAL_UE_PROXY_ADDRESS}/ping-task`, req.body, data => data).then(result => {
        res.status(200).send(result)
    }).catch(errorObject => {
        errorObject.status ? res.status(errorObject.status).send(errorObject.message) : res.send(errorObject.message)
    })
};