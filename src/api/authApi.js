import api from "./api.config"

const authApi = {
    login(email, password) {
        return api.post(`auth/login`,{ email, password })
    },

    logout(id) {
        return api.post(`auth/logout`,{id})
    },

    signup(fullname, email, password) {
        return api.post(`auth/signup`, {fullname, email, password})
    },

    accessToken() {
        return api.get(`auth/accessToken`)
    },

    refreshToken() {
        return api.get(`auth/refreshToken`)
    }
}

export default authApi