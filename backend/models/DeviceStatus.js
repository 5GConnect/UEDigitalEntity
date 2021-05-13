module.exports = deviceStatus = (function() {
    var status = 'UNKNOWN'
    var campedCell = null

    return { // public interface
        updateStatus(receivedStatus) {
            if (status !== receivedStatus) {
                status = receivedStatus
                return true
            }
            return false
        },
        updateCampedCell(receivedCampedCell) {
            if (receivedCampedCell && campedCell !== receivedCampedCell) {
                campedCell = receivedCampedCell
                return true
            }
            return false
        },
        resetDeviceStatus() {
            status = 'UNKNOWN'
            campedCell = null
        },
        toJSON() {
            return {
                status: status,
                campedCell: campedCell
            }
        }
    };
})();
