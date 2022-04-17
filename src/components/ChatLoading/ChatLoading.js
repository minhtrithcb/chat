import React from 'react'
import typing from '../../assets/images/loading.gif'
import styles from './ChatLoading.module.scss'

export const ConversationItemLoading = ({username}) => {    
    return (
      <div className={styles.chatLoading2}>
        {username &&<small>{username} Đang nhập</small>}
        <img src={typing} alt="typing" className={styles.img} />
      </div>
    )
}

const ChatLoading = ({username}) => {
  return (
    <div className={styles.chatLoading}>
        <p>{username} đang nhập</p>
        <img src={typing} alt="typing" className={styles.img} />
    </div>
  )
}

export default ChatLoading