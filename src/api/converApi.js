import api from "./api.config"

const converApi = {
    createFriendConver(senderId, receiverId) {
        return api.post(`conversation/`, {
            senderId, receiverId
        })
    },
    deleteByFriendId(currentUserId, friendId) {
        return api.post(`conversation/delete`, {currentUserId, friendId})
    },
    getByUserId(userId) {
        return api.get(`conversation/${userId}`)
    },
    getLastMessage(converId) {
        return api.get(`conversation/lastMsg/${converId}`)
    }
}

export default converApi