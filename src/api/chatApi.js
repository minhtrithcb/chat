import api from "./api.config"

const chatApi = {
    getChatByRoomId (roomId) {
        return api.get(`chat/${roomId}`)
    },
    postNewChat ({roomId, sender, text}) {
        return api.post(`chat`, {roomId, sender, text})
    }
}

export default chatApi