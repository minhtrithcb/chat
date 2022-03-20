import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import authApi from '../api/authApi'

const useAuth = () => {
    const {auth, setAuth} = useContext(AuthContext)

    useEffect(() => {
        async function getAccessToken() {
            console.log("call api get accessToken");
            let {data} = await authApi.accessToken()
            setAuth(data)
        }
        getAccessToken()
    }, [setAuth])

    return {auth, setAuth}
}

export default useAuth