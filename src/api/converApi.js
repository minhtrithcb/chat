import api from "./api.config"

const converApi = {
    getByUserId(userId) {
        return api.get(`conversation/${userId}`)
    },
    getLastMessage(converId) {
        return api.get(`conversation/lastMsg/${converId}`)
    }
}

export default converApi