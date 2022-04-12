import React, { createContext, useState } from 'react'

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [friend, setFriend] = useState(null)
    const [chatEdit, setChatEdit] = useState(null)
    
    const value = {
        currentChat,
        setCurrentChat,
        friend,
        setFriend,
        chatEdit,
        setChatEdit
    }        

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider