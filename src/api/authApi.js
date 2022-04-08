import api from "./api.config"

const authApi = {
    login(email, password) {
        return api.post(`auth/login`,{ email, password })
    },

    logout() {
        return api.post(`auth/logout`)
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