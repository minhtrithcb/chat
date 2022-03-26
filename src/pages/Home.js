import React from 'react'
import Contact from '../components/Contact/Contact'
import Messages from '../components/Messages/Messages'

const Home = () => {
  return (
    <div className="d-flex">
      <Contact/>
      <Messages />
    </div>
  )
}

export default Home