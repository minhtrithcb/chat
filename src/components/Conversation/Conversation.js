import React, { useContext, useEffect,  useState } from 'react'
import styles from './Conversation.module.scss'
import clsx from 'clsx'
import useTheme  from '../../hooks/useTheme'
import converApi from '../../api/converApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { ChatContext } from '../../context/ChatContext'
import ConversationItem from '../ConversationItem/ConversationItem'
import { SocketContext } from '../../context/SocketContext'

const Conversation = () => {
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
    const [usersOnline, setUsersOnline] = useState(null)
    const {socket} = useContext(SocketContext)

    // Get all users online
    useEffect(() => {
        let isMounted = true;    

        socket.on("getUser", usersOnline => {
            if (isMounted) setUsersOnline(usersOnline) // Array users online
        })

        return () => { isMounted = false };
    }, [friend, socket])    

    // Feach all conversations of current user
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
                <p>Tin nhắn</p>
                <input type="text" placeholder='Tìm kiếm ...' />
            </div>

            <div className={classesDarkMode2}>                
                {/* ///// All messages  */}
                <small>Tất cả tin nhắn</small>
                {conversations && conversations.map((conver) => (
                    <div onClick={() => setCurrentChat(conver)} key={conver._id}>
                        <ConversationItem 
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

export default Conversation