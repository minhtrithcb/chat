import api from "./api.config"

const converApi = {
    getByUserId({userId, type}) {
        return api.get(`conversation/get`, {
            params : {
                userId, type
            }
        })
    },
    getCountUnReadMsg(userId) {
        return api.get(`conversation/getCountUnReadMsg/${userId}`)
    },
    getOneByUserId(currentUserId, friendId) {
        return api.post(`conversation/getOne`, {
            currentUserId, 
            friendId
        })
    },
    postUnReadMsg({roomId, senderId, recivers}) {
        return api.post(`conversation/postUnReadMsg`, {
            roomId, 
            senderId,
            recivers
        })
    },
    postReadMsg({roomId, currentUserId}) {
        return api.post(`conversation/postReadMsg`, {
            roomId, 
            currentUserId
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
    leaveGroup(currentUserId, roomId) {
        return api.post(`conversation/leave-group`, {currentUserId, roomId})
    },
    deleteGroup(currentUserId, roomId) {
        return api.post(`conversation/delete-group`, {currentUserId, roomId})
    },
    getLastMessage(converId) {
        return api.get(`conversation/lastMsg/${converId}`)
    }
}

export default converApi