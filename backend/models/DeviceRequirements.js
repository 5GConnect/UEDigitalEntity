module.exports = DeviceRequirement = (function() {
  let requirement2PduType = new Map()
  requirement2PduType.set("HIGH_BANDWIDTH", {sst: "1", sd: "000001", ddn: "internet", pdu_session_type: "IpV4"})
  requirement2PduType.set("LOW_BANDWIDTH", {sst: "1", sd: "000002", ddn: "internet", pdu_session_type: "IpV4"})

  let requirements2PduSessionId = new Map()

  return {
      addRequirement2PduSessionIdMapping(requirement, pduId) {
        if (!requirements2PduSessionId.has(requirement)) {
          requirements2PduSessionId.set(requirement, [pduId]);
          return;
        }
        requirements2PduSessionId.get(requirement).push(pduId);
      },
      removeRequirement(requirement) {
        requirements2PduSessionId.delete(requirement)
      },
      getActiveRequirementsAndSessionIds() {
        return Object.fromEntries(requirements2PduSessionId)
      },
      getPduTypeByRequirement(requirement) {
        return (requirement2PduType.get(requirement))
      }
  };
})();


