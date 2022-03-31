import api from "./api.config"

const userApi = {
    getByUserId (userId) {
        return api.get(`user/${userId}`)
    },
    search (search, currentUser) {
        return api.post(`user/search`,{search, currentUser})
    }
}

export default userApi