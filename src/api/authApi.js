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
    },

    forgotPassword(email) {
        return api.post(`auth/forgotPassword`, {email})
    },

    sendVerify(email) {
        return api.post(`auth/send-verify`, {email})
    },

    checkVerifyOTP(email, otp) {
        return api.post(`auth/check-verify`, {email, otp})
    }
}

export default authApi