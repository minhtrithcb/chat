import api from "./api.config"

const userApi = {
    getByUserId (userId) {
        return api.get(`user/${userId}`)
    }
}

export default userApi