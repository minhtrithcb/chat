import React, { useContext, useEffect, useRef, useState } from 'react'
import FriendProfile from '../FriendProfile/FriendProfile';
import styles from "./Chats.module.scss"
import avatar from '../../assets/images/user.png'
import { FiAlignRight, FiMenu } from "react-icons/fi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import clsx from 'clsx';
import useToggle from '../../hooks/useToggle';
import useTheme  from '../../hooks/useTheme'
import chatApi from '../../api/chatApi';
import { ChatContext } from '../../context/ChatContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import NotHaveChat from '../NotHaveChat/NotHaveChat';
import ChatItem from '../ChatItem/ChatItem';
import ChatForm from '../ChatForm/ChatForm';
import { SocketContext } from '../../context/SocketContext';

const Chats = () => {
    const [toggle, setToggle] = useToggle(false)
    const [chats, setChats] = useState([])
    const {theme} = useTheme()
    const bottomRef = useRef()
    const {currentChat, friend, setCurrentChat} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()

    const classesDarkMode = clsx(styles.conversation,{ 
        [styles.dark]: theme === "dark"
    })

    // Get new message & display
    useEffect(() => {        
        let isMounted = true;   

        socket.on("getMessage", data => {
            if (data) {
                if(isMounted) setChats(prevChat => [...prevChat, data]);
                bottomRef?.current?.scrollIntoView({behavior: "smooth"})
            }
        })

        return () => { 
            isMounted = false 
        };
    }, [socket,bottomRef])
    
    // Join room when user chose friend to chat
    useEffect(() => {
        socket.emit("join room", currentChat?._id)
        return () => {
            socket.emit("leave room", currentChat?._id)
        }
    }, [currentChat, socket])

    const toTheBottom = () => {
        if (bottomRef.current !== undefined) {
            bottomRef.current.scrollIntoView()
        }
    }
    
    // Fetch all chat by id conversation
    useEffect(() => {
        let isMounted = true;   
        const getChats = async () => {
            try {
                if (currentChat) {
                    const {data} = await chatApi.getChatByRoomId(`${currentChat?._id}`)
                    if (isMounted) 
                        setChats(data.reverse()); 
                        toTheBottom()
                }
            } catch (error) {
                console.log(error);
            }
            
        }
        getChats()
        return () => { 
            isMounted = false 
        };
    }, [currentChat])

    return (
        <>
            {!currentChat ? 
            <NotHaveChat />
            : <div className={classesDarkMode} >
                {/* // Desktop view  */}
                <div className={styles.friendCover}>
                    {friend && <div>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="friend" />
                        </div>
                        <span className={styles.des}>
                            <b>{friend.fullname}</b>
                            <small>#{friend.email}</small>
                        </span>
                    </div> }

                    <div onClick={setToggle}>
                        {toggle ? <FiAlignRight /> : <FiMenu />}
                    </div>
                </div>
                {/* // Mobile View  */}
                <div className={styles.mobileViewCover}>
                    <div className={styles.goBackBtn} onClick={() => setCurrentChat(null)}>
                        <MdOutlineArrowBackIos />
                    </div>

                    {friend && <b>{friend.fullname}</b> }
                    
                    {/* // Fake div  */}
                    <div></div>
                </div>

                {/* // Render all chat  */}
                <div className={styles.chatContainer} >
                    {chats && chats.map(chat => (
                        <ChatItem
                            key={chat._id} 
                            self={chat.sender === currentUser.id} 
                            data={chat} 
                        />
                    ))}
                    <div ref={bottomRef}></div>
                </div>
                {/* // From Chat  */}
                <ChatForm />
            </div>}
            {toggle && <FriendProfile />}
        </>
    )
}

export default Chats