import axios from "axios";
import authApi from "./authApi";

const api = axios.create({
  baseURL: 'http://localhost:2077/api/',
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor
api.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error && error.response?.status === 401) {
    const {data} = await authApi.refreshToken()

    if (data?.isLogin) {
      window.location = "/"
    }
  }
  return Promise.reject(error);
});

export default api