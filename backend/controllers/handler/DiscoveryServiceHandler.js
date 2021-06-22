'use strict';
const logger = require('../../utils/logger')
const requestManager = require('../utils/RequestManager')

module.exports.sendSignal = (ueID) => {
    logger.info("Sending registartion or keep alive signal...");
    let bodyData = {
        'supi': ueID,
        'ip': {
            'ipv4Addr': process.env.ADDRESS
        },
        'port': process.env.PORT
    }
    return requestManager.makeARequestWithBodyData('POST', `${process.env.SERVICE_REGISTRY}/UE`, bodyData, data => data)
}