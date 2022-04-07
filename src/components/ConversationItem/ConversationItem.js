import React, {  useContext, useEffect, useState } from 'react'
import styles from './ConversationItem.module.scss'
import avatar from '../../assets/images/user.png'
import clsx from 'clsx'
import useTheme from '../../hooks/useTheme'
import userApi from '../../api/userApi'
import { ChatContext } from '../../context/ChatContext'
import converApi from '../../api/converApi'
import moment from 'moment'
import 'moment/locale/vi'
import { SocketContext } from '../../context/SocketContext'

const ConversationItem = ({activeChat , conversation, currentUserId, usersOnline}) => {
    const {socket} = useContext(SocketContext)
    
    const {theme} = useTheme()
    const [friendState, setFriendState] = useState({})
    const [lastMsg, setLastMsg] = useState(null)
    const {setFriend} = useContext(ChatContext)
    const [onlineFriend, setOnlineFriend] = useState(false)
    const classesDarkMode = clsx(styles.messagesItem,{ 
        [styles.dark]: theme === "dark",
        [styles.active]: activeChat
    })

    // Get new message & display
    useEffect(() => {        
        socket.on("getSomeOneMessage", data => {
            if (data.roomId === conversation._id) {
                setLastMsg(data);
            }
        })
    }, [socket, conversation])
    
    // loop to find userId not current user
    const friendId = conversation.members.find(u => u !== currentUserId)

    // Fetch Friend by members id
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
    
    // set state users online
    useEffect(() => {
        if(usersOnline !== undefined) {
            let res = usersOnline?.find(u => u.uid === friendId)
            if(res !== undefined) setOnlineFriend(true) 
        }

        return () => {
            setOnlineFriend(false)
        }
    },[usersOnline, friendId])
    
    // Get a new msg
    useEffect(() => {
        const  getLastMessage = async () => {
            try {
                const {data} = await converApi.getLastMessage(conversation._id)
                setLastMsg(data);
            } catch (error) {
                console.log(error);
            }
        }
        getLastMessage()
    }, [conversation])

    return (
         <div className={classesDarkMode}>
            {friendState && 
            <>
                <span className={styles.avatarConatiner}>
                    <div className={styles.avatar}>
                        <img src={avatar} alt="friend" />
                    </div>
                    {onlineFriend && <span className={styles.isOnline}></span>}
                </span>
                <span>
                    <b>{friendState.fullname}</b>
                    {lastMsg && <p>{lastMsg.text.length > 10 ? `${lastMsg.text.slice(0, 10)} ...`: lastMsg.text}  </p>}
                </span>
                <span>
                    <small>{lastMsg && moment(lastMsg.createdAt).fromNow()}</small>
                    {/* <p>2</p> */}
                </span>
            </>}
        </div> 
    )
}

export default ConversationItem 