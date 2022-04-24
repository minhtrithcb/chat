import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react'
import converApi from '../api/converApi';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [friend, setFriend] = useState(null)
    const [chatEdit, setChatEdit] = useState(null)
    const [chatReply, setChatReply] = useState(null)
    const [chatsOption, setChatsOption] = useState({type:  'All', title: 'Tất cả tin nhắn'})
    const [userReadConver, setUserReadConver] = useState(null)
    const [countUnRead, setCountUnRead] = useState(0)
    const {auth} = useContext(AuthContext)

    const value = {
        currentChat,
        setCurrentChat,
        friend,
        setFriend,
        chatEdit,
        setChatEdit,
        chatReply,
        setChatReply,
        chatsOption,
        setChatsOption,
        userReadConver,
        setUserReadConver,
        countUnRead, 
        setCountUnRead,
    }        

    // Feach all get Count UnReadMsg
    useEffect(() => {
        let isMounted = true;   
        const  getCountUnReadMsg = async () => {
            try {
                if (auth.accessToken) {
                    let currentUser = jwtDecode(auth.accessToken) 
                    const {data} = await converApi.getCountUnReadMsg(currentUser.id)
                    if (isMounted) {
                        const readBy = data.map(c => {
                            return c.readBy.find(u => u._id === currentUser.id) || {count: 0}
                        })
                        const count = readBy.reduce((p, c) => {
                            return c._id === currentUser.id ? p + c.count : p + 0
                        }, 0)
                        setCountUnRead(count)
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        getCountUnReadMsg()
        return () => { 
            isMounted = false 
        };
    }, [auth, userReadConver])   

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider