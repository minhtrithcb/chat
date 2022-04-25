import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useEffect } from 'react'
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

const SocketProvider = ({children}) => {
    const socket = io("http://localhost:2077")
    const {auth} = useContext(AuthContext)
 
    useEffect(() => {
        // Frist time auth accessToken is undife 
        if (auth.accessToken) {
            let currentUser = jwtDecode(auth.accessToken)
            socket.emit("join server", currentUser.id)
        } else {
            socket.disconnect()    
        }

        // eslint-disable-next-line
        return () => socket.disconnect()    
    }, [auth.accessToken, socket])

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider