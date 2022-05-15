import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authApi from "./authApi";


const api = axios.create({
    baseURL: 'https://react-chat-101.herokuapp.com/api',
    timeout: 10000,
    withCredentials: true,
});

const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    // const location = useLocation();
    // const from = location?.pathname || "/"
    const {setAuth} = useContext(AuthContext)

    useEffect(() => {
        const resInterceptor = response => {
            return response;
        }
        const errInterceptor = async error => {
            const prevReq = error?.config
            if (error?.response?.status === 401 && !prevReq?.sent) {
                prevReq.sent = true
                const {data} = await authApi.refreshToken()
                if (data.isLogin) {
                    setAuth({isLogin: true, accessToken:  data.accessToken, loading: false})
                } else if (data.reload) {
                    setAuth({isLogin: false})
                    navigate("/login", {replace: true})
                } else {
                    setAuth({isLogin: false})
                    navigate("/login", {replace: true})
                }
                return api(prevReq)
            } 
            
            // If status 403 mean you dont have cookies accessTk and RefreshTk push back to login
            if (error.response?.status === 403) {
                setAuth({isLogin: false})
                navigate("/login", {replace: true})
            }
            
            return Promise.reject(error);
        }

        const interceptor = api.interceptors.response.use(resInterceptor, errInterceptor);

        return () => api.interceptors.response.eject(interceptor);
        // eslint-disable-next-line
    }, []) 
    return children;
}

export { AxiosInterceptor }

export default api