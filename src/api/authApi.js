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

    checkVerifyOTP(email, otp) {
        return api.post(`auth/check-verify`, {email, otp})
    },

    checkValidResetPass(token) {
        return api.post(`auth/check-token-reset-pass`, {token})
    },

    resetPassword (userId, password) {
        return api.post(`auth/reset-password`, {userId, password})
    },

    resetwithOldPassword ({oldPassword, userId, password}) {
        return api.post(`auth/reset-oldPassword`, {oldPassword, userId, password})
    },

    forgotPassword(email) {
        return api.post(`auth/forgotPassword`, {email})
    },

    sendVerify(email) {
        return api.post(`auth/send-verify`, {email})
    },
}

export default authApi