import api from "./api.config"

const converApi = {
    getByUserId({userId, type}) {
        return api.post(`conversation/get`, {
            userId, type
        })
    },
    createFriendConver(senderId, receiverId) {
        return api.post(`conversation/postFriend`, {
            senderId, receiverId
        })
    },
    createGroptConver({members, owner, nameGroup}) {
        return api.post(`conversation/postGroup`, {
            members, owner, nameGroup
        })
    },
    deleteByFriendId(currentUserId, friendId) {
        return api.post(`conversation/delete`, {currentUserId, friendId})
    },
    getLastMessage(converId) {
        return api.get(`conversation/lastMsg/${converId}`)
    }
}

export default converApi