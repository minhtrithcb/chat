import api from "./api.config"

const userApi = {
    getFriendUser (id) {
        return api.get(`user/friend/${id}`)
    },
    getByUserId (userId) {
        return api.get(`user/${userId}`)
    },
    unFriend (currentUserId, friendId) {
        return api.post(`user/unfrined`,{currentUserId, friendId})
    },
    search (search, currentUser) {
        return api.post(`user/search`,{search, currentUser})
    }
}

export default userApi