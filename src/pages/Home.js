import React from 'react'
import Chats from '../components/Chats/Chats'
import Conversation from '../components/Conversation/Conversation'

const Home = () => {
  return (
    <div className="d-flex">
      <Conversation />
      <Chats />
    </div>
  )
}

export default Home