const discoveryHandler = require('./handler/DiscoveryServiceHandler')
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const logger = require('../utils/logger')
let updateProcessId = null
let ueSupi = null

module.exports.sendPeriodicalSignal = async() => {
    let that = this;
    try {
        if (ueSupi === null) {
            ueSupi = await deviceInfoHandler.getDeviceId()
        }
        logger.info(`[${ueSupi}] Sending discovery signal`)
        await discoveryHandler.sendSignal(ueSupi)
        if (updateProcessId === null) {
            logger.debug(`[${ueSupi}] Register periodic signal update every ${process.env.KEEP_ALIVE_TIME_IN_MS} ms`)
            updateProcessId = setInterval(function() {
                that.sendPeriodicalSignal()
            }, process.env.KEEP_ALIVE_TIME_IN_MS);
        }
    } catch (errorObject) {
        logger.error(`Something went wrong: ${errorObject.message}`)
    }
}