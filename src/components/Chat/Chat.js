import clsx from 'clsx'
import React from 'react'
import boy from '../../assets/images/boy.png'
import useTheme  from '../../hooks/useTheme'
import styles from "./Chat.module.scss"

const Chat = ({self, data}) => {

    const {theme} = useTheme()

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
                        <img src={boy} alt="userChat" />
                    </div>
                    <p>{data.text}</p>
                    <span></span>
                </div>
            </div>
            // Friend
            :<div className={classesDarkMode}>
                <small>{data.sender.name}</small>
                <div className={styles.friendMess }>
                    <span></span>
                    <p>{data.text}</p>
                    <div className={clsAvatar}>
                        <img src={boy} alt="userChat" />
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Chat