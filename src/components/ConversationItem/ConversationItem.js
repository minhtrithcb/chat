import React, {  useContext, useEffect, useState } from 'react'
import styles from './ConversationItem.module.scss'
import avatar from '../../assets/images/user.png'
import clsx from 'clsx'
import useTheme from '../../hooks/useTheme'
import moment from 'moment'
import 'moment/locale/vi'
import { SocketContext } from '../../context/SocketContext'
import {ConversationItemLoading} from '../ChatLoading/ChatLoading'
import useDecodeJwt from '../../hooks/useDecodeJwt'

const ConversationItem = ({activeChat , conversation, friends, usersOnline}) => {
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const [pendingChat, setPendingChat] = useState(false)
    const {theme} = useTheme()
    const [lastMsg, setLastMsg] = useState(conversation.lastMsg)
    const [onlineFriend, setOnlineFriend] = useState(false)
    const classesDarkMode = clsx(styles.messagesItem,{ 
        [styles.dark]: theme === "dark",
        [styles.active]: activeChat
    })

    // Get new message & display
    useEffect(() => {        
        let isMounted = true;            

        // Get and display new msg
        socket.on("getSomeOneMessage", data => {
            if (data.roomId === conversation._id) {
                setLastMsg(data);
            }
        })
        // Get and display new update last msg ex: recall last msg > display "Tin nhắn đã bị thu hồi"
        socket.on("getLastActivity", ({result, room}) => {
            if (result?.roomId === conversation._id && 
                room?._id === result?.roomId) {
                    setLastMsg(result);
            }
        })

        // // Event pending
        socket.on("getPendingByFriend", ({roomId, reciverId}) => {
            if (isMounted && roomId === conversation?._id &&
                reciverId === currentUser.id
                ) {
                setPendingChat(true)
            }
        })
        // // // Event stop pending
        socket.on("stopPendingByFriend", data => {
            if (isMounted && data) {
                setPendingChat(false)
            }
        })

        return () => { isMounted = false };

    }, [socket, conversation, currentUser.id])

    // set state users online
    useEffect(() => {
        if(usersOnline !== undefined) {
            let res = usersOnline?.find(u => u.uid === friends[0]._id)
            if(res !== undefined) setOnlineFriend(true) 
        }
        return () => {
            setOnlineFriend(false)
        }
    },[usersOnline, friends])    

    return (
         <div className={classesDarkMode}>
            <span className={styles.avatarConatiner}>
                <div className={styles.avatar}>
                    <img src={avatar} alt="friend" />
                </div>
                {onlineFriend && <span className={styles.isOnline}></span>}
            </span>
            <span>
                <b>{friends[0].fullname}</b>
                {lastMsg && !lastMsg.reCall ? 
                    <p>{lastMsg.text.length > 10 ? `${lastMsg.text.substring(0, 10)} ...`: lastMsg.text}  </p>:
                    lastMsg?.reCall && <p className={styles.italic}>{"Tin nhắn đã bị thu hồi".substring(0, 11)} ...</p>
                }
            </span>
            <span>
                {pendingChat && <ConversationItemLoading />}
                <small>{lastMsg && moment(lastMsg.createdAt).fromNow()}</small>
            </span>
        </div> 
    )
}

export default ConversationItem 