import clsx from 'clsx'
import moment from 'moment'
import 'moment/locale/vi'
import React, { useContext } from 'react'
import avatar from '../../assets/images/user.png'
import { ChatContext } from '../../context/ChatContext'
import useTheme  from '../../hooks/useTheme'
import styles from "./ChatItem.module.scss"

const ChatItem = ({self, data}) => {
    const {theme} = useTheme()
    const {friend} = useContext(ChatContext)
    const clsAvatar = clsx(styles.avatar, styles.avatar2)

    const classesDarkMode = clsx(styles.chatUser,{ 
        [styles.dark]: theme === "dark"
    })

    return (
        <>
            {self ? 
            // Self 
            <div className={classesDarkMode}>
                <div className={styles.userMess }>
                    <div className={styles.avatar}>
                        <img src={avatar} alt="userChat" />
                    </div>
                    <p>
                        {data.text}
                    </p>                    
                    <span></span>
                </div>
                <p>{moment(data.createdAt).fromNow()}</p>
            </div>
            // Friend
            :<div className={classesDarkMode}>
                <small>{friend && friend.fullname}</small>
                <div className={styles.friendMess}>
                    <span></span>
                    <p>{data.text}</p>
                    <div className={clsAvatar}>
                        <img src={avatar} alt="userChat" />
                    </div>
                </div>
                <p>{moment(data.createdAt).fromNow()}</p>
            </div>}
        </>
    )
}

export default ChatItem