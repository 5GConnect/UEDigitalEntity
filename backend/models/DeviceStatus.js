module.exports = deviceStatus = (function() {
    let status = 'UNKNOWN'
    let campedCell = null
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
        toString() {
            return JSON.stringify({
                "status": status,
                "camped-cell": campedCell
            })
        }
    };
})();
