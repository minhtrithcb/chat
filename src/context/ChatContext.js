import React, { createContext, useState } from 'react'

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [friend, setFriend] = useState(null)
    const [chatEdit, setChatEdit] = useState(null)
    const [chatReply, setChatReply] = useState(null)
    const [chatsOption, setChatsOption] = useState({type:  'All', title: 'Tất cả tin nhắn'})
    const [userRead, setUserRead] = useState(false)
    const [countUnRead, setCountUnRead] = useState(0)

    
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
        userRead,
        setUserRead,
        countUnRead, 
        setCountUnRead
    }        

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider