module.exports = DeviceRequirement = (function() {
    let requirement2PduType = new Map()
    requirement2PduType.set("HIGH_BANDWIDTH", { sst: 1, sd: "000001", dnn: "internet", pduSessionType: "IPV4" })
    requirement2PduType.set("LOW_BANDWIDTH", { sst: 1, sd: "000002", dnn: "internet", pduSessionType: "IPV4" })

    return {
        getPduTypeByRequirement(requirement) {
            return requirement2PduType.has(requirement) ? requirement2PduType.get(requirement) : {}
        }
    };
})();