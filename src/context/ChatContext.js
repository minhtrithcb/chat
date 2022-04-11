import React, { createContext, useState } from 'react'

export const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [currentChat, setCurrentChat] = useState(null)
    const [friend, setFriend] = useState(null)
    const [chatReaction, setChatReaction] = useState(null)
    
    const value = {
        currentChat,
        setCurrentChat,
        friend,
        setFriend,
        chatReaction,
        setChatReaction
    }        

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider