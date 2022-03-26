import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './Contact.module.scss'
import clsx from 'clsx'
import useTheme  from '../../hooks/useTheme'
import converApi from '../../api/converApi'
import Conversation from '../Conversation/Conversation'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { ChatContext } from '../../context/ChatContext'
import { io } from 'socket.io-client';

const Contact = () => {
    const [conversations, setConversations] = useState([])
    const [currentUser] = useDecodeJwt()
    const {currentChat, setCurrentChat, friend} = useContext(ChatContext)
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.contact,{ 
        [styles.dark]: theme === "dark"
    })
    const classesDarkMode2 = clsx(styles.messages,{ 
        [styles.dark]: theme === "dark"
    })
    const socket = useRef()
    const [usersOnline, setUsersOnline] = useState(null)

    // Init connection
    useEffect(() => {
        let isMounted = true;    

        socket.current = io("http://localhost:2077")

        socket.current.on("getUser", usersOnline => {
            // console.log(usersOnline);
            if (isMounted) setUsersOnline(usersOnline)
        })
        return () => { isMounted = false };

    }, [friend])    

    // Get all conversation of current user
    useEffect(() => {
        let isMounted = true;    
        const  getAllconvertation = async () => {
            try {
                const {data} = await converApi.getByUserId(currentUser.id)
                // console.log(data);
                if (isMounted) setConversations(data);
            } catch (error) {
                console.log(error);
            }
        }
        getAllconvertation()
        return () => { isMounted = false };
    }, [currentUser.id])
    
    return (
        <div className={classesDarkMode}>
            <div className={styles.heading}>
                <p>Messages (20)</p>
                <input type="text" placeholder='Search ...' />
            </div>

            <div className={classesDarkMode2}>                
                {/* ///// All messages  */}
                <small>All messages</small>
                {conversations && conversations.map((conver) => (
                    <div onClick={() => setCurrentChat(conver)} key={conver._id}>
                        <Conversation 
                            usersOnline={usersOnline}
                            conversation={conver} 
                            currentUserId={currentUser.id} 
                            activeChat={currentChat && currentChat?._id === conver._id}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Contact