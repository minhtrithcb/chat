import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({isLogin: false, loading: true})    
    // console.log("render provider");
    // Fetch access token when first load 
    useEffect(() => {
        async function getAccessToken() {
            // console.log("call api provider");
            try {
                // Set loading to false and taht will skip condition
                let {data} = await authApi.accessToken()
                // and render provider
                setAuth({loading: false, ...data})
            } catch (error) {
                // console.log(error);
                if (error?.response?.status === 401) {
                    const {data} = await authApi.refreshToken()
                    if (data.isLogin) {
                    //   console.log('get new accesTk ny RT xxxx');
                      setAuth({isLogin: true, accessToken:  data.accessToken, loading: false})
                    }
                }

                if (error?.response?.status === 403) {
                    navigate("/login", {replace: true})
                }
            }
        }
        getAccessToken()
        // eslint-disable-next-line
    }, [])    

    // This condition will run first to render nothing
    // then after that cpn will call fetch api ...
    if (auth.loading) {
        // console.log("loading");
        return <></>;
    }

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider