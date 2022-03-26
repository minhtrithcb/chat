import { useContext } from 'react'
import jwtDecode from 'jwt-decode'
import {AuthContext} from '../context/AuthContext'

const useDecodeJwt = () => {
    const {auth} = useContext(AuthContext)
    const currentUser = jwtDecode(auth.accessToken)
    return [currentUser]
}

export default useDecodeJwt