import React, { useContext } from 'react'
import Chats from '../components/Chats/Chats'
import Conversation from '../components/Conversation/Conversation'
import NotHaveChat from '../components/NotHaveChat/NotHaveChat'
import { ChatContext } from '../context/ChatContext'

const Home = () => {
  const {currentChat} = useContext(ChatContext)

  return (
    <div className="d-flex">
      <Conversation />
        {!currentChat ? 
        <NotHaveChat />:
        <Chats />}
    </div>
  )
}

export default Home