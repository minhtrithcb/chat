import api from "./api.config"

const converApi = {
    getByUserId (userId) {
        return api.get(`conversation/${userId}`)
    }
}

export default converApi