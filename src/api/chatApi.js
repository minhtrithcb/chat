import api from "./api.config"

const chatApi = {
    getChatByRoomId(roomId, offset) {
        return api.get(`chat/${roomId}/${offset}`)
    },
    postNewChat({roomId, sender, text}) {
        return api.post(`chat`, {roomId, sender, text})
    },
    postReplyChat({roomId, sender, text, replyMsg}) {
        return api.post(`chat/reply`, {roomId, sender, text, replyMsg})
    },
    postReaction({chatId, user, type}) {
        return api.post(`chat/reaction`, {chatId, user, type})
    },
    reCallChat({roomId, chatId, sender}) {
        return api.post(`chat/reCall`, {roomId, chatId, sender})
    },
    patchChat({roomId, chatId, sender, text}) {
        return api.patch(`chat/`, {roomId, chatId, sender, text})
    }
}

export default chatApi