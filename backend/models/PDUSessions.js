class EstablishPduSession {
    constructor(sst, sd, dnn, type, ipAddress, emergency, id) {
        this.sst = sst
        this.sd = sd
        this.dnn = dnn
        this.type = type
        this.ipAddress = ipAddress
        this.emergency = emergency
        this.id = id
    }
    equals(id) {
        return this.id === id
    }
    toJSON() {
        return {
            sst: this.sst,
            sd: this.sd,
            dnn: this.dnn,
            pduSessionType: this.type,
            ipAddress: this.ipAddress,
            emergency: this.emergency,
            id: this.id
        }
    }
}

module.exports = pduSessions = (function() {
    var sessions = []

    return { // public interface
        // Technical Debt: We do not need to check pdu session with status command, but with SMF API (event subscriptio).
        //The API is not available in O5GS already.
        addSession(sessionInfo) {
            if (sessions.every(session => !session.equals(sessionInfo.id))) {
                sessions.push(new EstablishPduSession(sessionInfo.sst,
                    sessionInfo.sd,
                    sessionInfo.dnn,
                    sessionInfo.pduSessionType,
                    sessionInfo.ipAddress,
                    sessionInfo.emergency,
                    sessionInfo.id))
            }
        },
        removeSession(id) {
            //remove session
        },
        resetDeviceStatus() {
            sessions = []
        },
        toString() {
            return JSON.stringify(sessions)
        },
        getSessions() {
            return sessions
        }
    };
})();