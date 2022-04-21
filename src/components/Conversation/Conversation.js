import React, { useContext, useEffect,  useState } from 'react'
import styles from './Conversation.module.scss'
import clsx from 'clsx'
import useTheme  from '../../hooks/useTheme'
import converApi from '../../api/converApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { ChatContext } from '../../context/ChatContext'
import ConversationItem from '../ConversationItem/ConversationItem'
import { SocketContext } from '../../context/SocketContext'
import ConversationOption from '../ConversationOption/ConversationOption'

const Conversation = () => {
    const [conversations, setConversations] = useState([])
    const [currentUser] = useDecodeJwt()
    const {currentChat, setCurrentChat, friend, setFriend, setChatEdit, setChatReply, chatsOption, setUserReadConver} = useContext(ChatContext)
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
                const {data} = await converApi.getByUserId({
                    userId: currentUser.id,
                    type: chatsOption.type
                })
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
        };
    }, [socket, currentUser.id, setCurrentChat, chatsOption])   

    // User chose Chat setCurrentChat & setFriend (for sending msg)
    const handleChoseChat = async (conversation) => {
        setCurrentChat(conversation)
        const friends = conversation.members.filter(u => u._id !== currentUser.id)
        setFriend(friends);        
        setChatEdit(null)
        setChatReply(null)
        // trigger flag
        setUserReadConver({_id: conversation._id, flag: true})
        // Post all user in list read
        await converApi.postReadMsg({
            roomId: conversation._id,
            currentUserId: currentUser.id
        })
    }

    return (
        <div className={classesDarkMode}>
            <h3>Tin nhắn</h3>
            <ConversationOption />
            
            <div className={classesDarkMode2}>        
            {conversations && 
                <>
                <small>{chatsOption.title}</small>
                { conversations.map((conver) => (
                    <div onClick={() => handleChoseChat(conver)} key={conver._id}>
                        <ConversationItem 
                            usersOnline={usersOnline}
                            conversation={conver} 
                            friends={conver.members.filter(u => u._id !== currentUser.id)}
                            activeChat={currentChat && currentChat?._id === conver._id}
                        />
                    </div>
                ))} 
                </> }
            </div>
        </div>
    )
}

export default Conversation