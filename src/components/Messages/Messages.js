import React, { useContext, useEffect, useRef, useState } from 'react'
import FriendProfile from '../FriendProfile/FriendProfile';
import styles from "./Messages.module.scss"
import avatar from '../../assets/images/user.png'
import { FiAlignRight, FiMenu } from "react-icons/fi";
import Chat from '../Chat/Chat';
import { TiLocationArrow } from "react-icons/ti";
import clsx from 'clsx';
import useToggle from '../../hooks/useToggle';
import useTheme  from '../../hooks/useTheme'
import chatApi from '../../api/chatApi';
import { ChatContext } from '../../context/ChatContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { io } from 'socket.io-client';

const Messages = () => {

    const [toggle, setToggle] = useToggle(false)
    const [chats, setChats] = useState([])
    const [inputChat, setInputChat] = useState("")
    const {theme} = useTheme()
    const bottomRef = useRef()
    const {currentChat, friend} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const socket = useRef()

    const classesDarkMode = clsx(styles.conversation,{ 
        [styles.dark]: theme === "dark"
    })
    
    // Init connection
    useEffect(() => {
        socket.current = io("http://localhost:2077")
    }, [])

    useEffect(() => {        
        socket.current.on("getMessage", data => {
            setChats(prevChat => [...prevChat, data]);
        })
    }, [])
    
    // Run everytime when user online
    useEffect(() => {
        socket.current.emit("join server", currentUser.id)
    
        socket.current.emit("join room", currentChat?._id)
        
        return () => {
            socket.current.emit("leave room", currentChat?._id)
        }

    }, [currentChat, currentUser.id])
    

    // Scroll end
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth'})
    }, [chats])

    // Get all chat by id conversation
    useEffect(() => {
        const getChats = async () => {
            if (currentChat !== null) {
                try {
                    const {data} = await chatApi.getChatByRoomId(currentChat._id)
                    setChats(data);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        getChats()
    }, [currentChat])

    // Submit send message
    const handleSubmit = async () => {
        if (inputChat !== "") {
            try {
                const {data} = await chatApi.postNewChat({
                    roomId: currentChat._id,
                    sender: currentUser.id,
                    text:   inputChat,
                })
                // Send to socket server
                socket.current.emit("send-msg", data)
                setInputChat("")
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    return (
        <>
            {currentChat && <div className={classesDarkMode} >
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
                
                <div className={styles.chatContainer} >
                    {chats && chats.map(chat => (
                        <Chat 
                            key={chat._id} 
                            self={chat.sender === currentUser.id} 
                            data={chat} 
                        />
                    ))}
                    <div ref={bottomRef}></div>
                </div>

                <div className={styles.chatForm} >
                    <textarea 
                        placeholder='write something ...'
                        value={inputChat} 
                        onChange={(e) => setInputChat(e.target.value)}
                    ></textarea>
                    <div className={styles.sendBtn} onClick={handleSubmit}>
                        <TiLocationArrow/>
                    </div>
                </div> 
            </div>}
            {toggle && <FriendProfile />}
        </>
    )
}

export default Messages