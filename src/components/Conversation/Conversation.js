import React, { useContext, useEffect, useState } from 'react'
import styles from './Conversation.module.scss'
import avatar from '../../assets/images/user.png'
import clsx from 'clsx'
import useTheme from '../../hooks/useTheme'
import userApi from '../../api/userApi'
import { ChatContext } from '../../context/ChatContext'

const Conversation = ({activeChat , conversation, currentUserId, usersOnline}) => {

    const {theme} = useTheme()
    const [friendState, setFriendState] = useState({})
    const {setFriend} = useContext(ChatContext)
    const [onlineFriend, setOnlineFriend] = useState(false)
    const classesDarkMode = clsx(styles.messagesItem,{ 
        [styles.dark]: theme === "dark",
        [styles.active]: activeChat
    })

    const friendId = conversation.members.find(u => u !== currentUserId)

    useEffect(() => {
        const getFriend = async () => {
            try {
                const {data} = await userApi.getByUserId(friendId)
                setFriendState(data);
                if(activeChat) setFriend(data);
            } catch (error) {
                console.log(error);
            }
        }
        getFriend()
    }, [activeChat, friendId, setFriend])
    
    useEffect(() => {
        if(usersOnline !== undefined) 
        {
            let res = usersOnline?.find(u => u.uid === friendState._id)
            if(res !== undefined) setOnlineFriend(true)
        }

        return () => {
            setOnlineFriend(false)
        }

    },[usersOnline, friendState])
    
    return (
         <div className={classesDarkMode}>
            {friendState && 
            <>
                <div className={styles.avatar}>
                    <img src={avatar} alt="friend" />
                    {onlineFriend && <span className={styles.isOnline}></span>}
                </div>
                <span>
                    <b>{friendState.fullname}</b>
                    <p>Gank team nà</p>
                </span>
                <span>
                    <small>2:20 PM</small>
                    <p>2</p>
                </span>
            </>}
        </div> 
    )
}

export default Conversation