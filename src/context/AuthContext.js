import React, { createContext, useEffect, useState } from 'react'
import authApi from '../api/authApi';

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({isLogin: false, loading: true})    
    // console.log("render provider");
    // Fetch access token when first load 
    useEffect(() => {
        async function getAccessToken() {
            // console.log("call api provider");

            let {data} = await authApi.accessToken()
            // Set loading to false and taht will skip condition
            // and render provider
            setAuth({loading: false, ...data})
        }
        getAccessToken()
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