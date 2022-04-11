import React, { useContext, useEffect,  useState } from 'react'
import styles from './Conversation.module.scss'
import clsx from 'clsx'
import useTheme  from '../../hooks/useTheme'
import converApi from '../../api/converApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { ChatContext } from '../../context/ChatContext'
import ConversationItem from '../ConversationItem/ConversationItem'
import { SocketContext } from '../../context/SocketContext'
import SearchBox from '../SearchBox/SearchBox'

const Conversation = () => {
    const [conversations, setConversations] = useState([])
    const [currentUser] = useDecodeJwt()
    const {currentChat, setCurrentChat, friend, setFriend, setChatReaction} = useContext(ChatContext)
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
    }, [friend, socket, currentChat])    

    // Feach all conversations of current user
    useEffect(() => {
        let isMounted = true;   
        const  getAllconvertation = async () => {
            try {
                const {data} = await converApi.getByUserId(currentUser.id)
                if (isMounted) {
                    setConversations(data);
                    socket.emit('join conversation')
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAllconvertation()
        return () => { 
            isMounted = false 
            setCurrentChat(null)
        };
    }, [socket, currentUser.id, setCurrentChat])   


    // User chose Chat setCurrentChat & setFriend (for sending msg)
    const handleChoseChat = (conversation) => {
        setCurrentChat(conversation)
        const friend = conversation.members.filter(u => u._id !== currentUser.id)
        setFriend(friend[0]);       
        setChatReaction(null) 
    }

    return (
        <div className={classesDarkMode}>
            <SearchBox />
            <div className={classesDarkMode2}>                
                {/* ///// All messages  */}
                <small>Tất cả tin nhắn</small>
                {conversations && conversations.map((conver) => (
                    <div onClick={() => handleChoseChat(conver)} key={conver._id}>
                        <ConversationItem 
                            usersOnline={usersOnline}
                            conversation={conver} 
                            friends={conver.members.filter(u => u._id !== currentUser.id)}
                            activeChat={currentChat && currentChat?._id === conver._id}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Conversation