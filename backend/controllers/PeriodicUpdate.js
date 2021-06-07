const wss = require('../index');
const deviceInfoHandler = require('./handler/DeviceInfoHandler')
const logger = require('../utils/logger')
const deviceStatusModel = require('../models/DeviceStatus')
let updateProcessIds = []
let started = false;

function getGnbConnectionStatus() {
    deviceInfoHandler.getGnbConnectionStatus()
        .then(result => {
            let receivedStatus = result.status
            let receivedCampedCell = result['camped-cell']
            let somethingHasChanged = false
            somethingHasChanged = deviceStatusModel.updateStatus(receivedStatus) || somethingHasChanged
            somethingHasChanged = deviceStatusModel.updateCampedCell(receivedCampedCell) || somethingHasChanged
            if (somethingHasChanged) {
                logger.info(`Sending status update ${deviceStatusModel.toString()}`)
            }
        })
        .catch(errorObject => {
            deviceStatusModel.resetDeviceStatus()
        })
}

function manageGnbConnectionStatusUpdate() {
    var processId = setInterval(function() {
        getGnbConnectionStatus()
    }, process.env.POLLING_STATUS_UPDATE_TIME_IN_MS);
    updateProcessIds.push(processId);
}

module.exports.startPolling = () => {
    if (!started) {
        logger.info("Start polling");
        manageGnbConnectionStatusUpdate();
    }
}

module.exports.stopPolling = () => {
    logger.info("Stop polling");
    updateProcessIds.forEach(processId => clearInterval(processId))
    updateProcessIds = []
    started = false
}