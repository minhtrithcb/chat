import api from "./api.config"

const chatApi = {
    getChatByRoomId(roomId) {
        return api.get(`chat/${roomId}`)
    },
    postNewChat({roomId, sender, text}) {
        return api.post(`chat`, {roomId, sender, text})
    },
    postReaction({chatId, user, type}) {
        return api.post(`chat/reaction`, {chatId, user, type})
    }
}

export default chatApi