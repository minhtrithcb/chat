import api from "./api.config"

const friendReqApi = {
    getFriendReq(sender) {
        return api.get(`friendReq/friend-request/${sender}`)
    },
    acceptFriendReq(id,sender, currentUserId) {
        return api.post(`friendReq/accept-friend-request`,{id,sender, currentUserId})
    },
    getAcceptFriendReq(reciver) {
        return api.get(`friendReq/accept-friend-request/${reciver}`)
    },
    createFriendReq(sender, reciver) {
        return api.post(`friendReq/create-friend-request`,{sender, reciver})
    },
    unSendFriendReq(reqId) {
        return api.post(`friendReq/unsend-friend-request`,{reqId})
    }
}

export default friendReqApi