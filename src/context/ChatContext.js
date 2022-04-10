import React, { createContext, useState } from 'react'

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [friend, setFriend] = useState(null)
    const [currentChatItem, setCurrentChatItem] = useState([])
    
    const value = {
        currentChat,
        setCurrentChat,
        friend,
        setFriend,
        currentChatItem,
        setCurrentChatItem
    }        

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider