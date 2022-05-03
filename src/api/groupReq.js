import api from "./api.config"

const groupReqApi = {
    getGroupReq(sender) {
        return api.get(`groupReq/group-request/${sender}`)
    },
    acceptGroupReq(reqId, roomId, senderId) {
        return api.post(`groupReq/accept-group-request`,{reqId, roomId, senderId})
    },
    getAcceptGroupReq(reciver) {
        return api.get(`groupReq/accept-group-request/${reciver}`)
    },
    createGroupReq(sender, reciver, room) {
        return api.post(`groupReq/create-group-request`,{sender, reciver, room})
    },
    unSendGroupReq(reqId) {
        return api.post(`groupReq/unsend-group-request`,{reqId})
    }
}

export default groupReqApi