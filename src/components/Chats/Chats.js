import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
import { Link } from 'react-router-dom';
import ChatLoading from '../ChatLoading/ChatLoading';
import FriendInfoTab from '../FriendInfoTab/FriendInfoTab';
import GroupInfoTab from '../GroupInfoTab/GroupInfoTab';
import Model from '../Common/Model/Model';
import useWidth from '../../hooks/useWidth'

const Chats = () => {
    const [toggle, setToggle] = useToggle(false)
    const [isOpen, setIsOpen] = useToggle(false)
    const [pendingChat, setPendingChat] = useToggle(false)
    const [sender, setSender] = useState('')
    const [chats, setChats] = useState([])
    const bottomRef = useRef()
    const {currentChat, friend, setCurrentChat} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.conversation,{ 
        [styles.dark]: theme === "dark"
    })

    // Listening even from socket
    useEffect(() => {        
        let isMounted = true;   
        // Get new msg in room
        socket.on("getMessage", data => {
            if (isMounted && data) {
                setChats(prevChat => [...prevChat, data]);
                // setCount(prev => prev + 1)
                bottomRef?.current?.scrollIntoView({behavior: "smooth"})
            }
        })
        // Get new update msg in room
        socket.on("getChangeChat", data => {
            if (isMounted && data) {
                setChats(prevChat => prevChat.map(chat => chat._id === data._id ? data : chat ));
            }
        })
        // Event pending
        socket.on("getPendingByFriend", ({roomId, reciverId, sender}) => {
            if (isMounted && roomId === currentChat?._id &&
                reciverId === currentUser.id
                ) {
                setPendingChat(true)
                setSender(sender)
                bottomRef?.current?.scrollIntoView({behavior: "smooth"})
            }
        })
        // // Event stop pending
        socket.on("stopPendingByFriend", data => {
            if (isMounted && data) {
                setPendingChat(false)
            }
        })

        return () => { 
            isMounted = false 
        };
    }, [socket, bottomRef, currentUser.id, setPendingChat, currentChat])
    
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
                    if (isMounted) {
                        setChats(data.reverse()); 
                        toTheBottom();
                    }
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

    // wid
    let myRef = useRef(null)
    const width = useWidth(myRef) 

    return (
        <>
            {!currentChat ? 
            <NotHaveChat />
            : <div className={classesDarkMode} ref={myRef} >
                {/* // Desktop view  */}
                <div className={styles.friendCover}>
                    {currentChat.type === 'Friend' ? <div>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="friend" />
                        </div>
                        <span className={styles.des}>
                            <b>{friend[0].fullname}</b>
                            <small>#{friend[0].email}</small>
                        </span>
                    </div> : 
                    <div>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="friend" />
                        </div>
                        <span className={styles.des}>
                            <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>
                            <small>{currentChat.members.length} Thành viên</small>
                        </span>
                    </div>}

                    {width > 769 && <div onClick={setToggle}>
                         {toggle ? <FiAlignRight /> : <FiMenu />}
                    </div>}
                </div>
                {/* // Mobile View  */}
                <div className={styles.mobileViewCover}>
                    <div className={styles.goBackBtn} onClick={() => setCurrentChat(null)}>
                        <MdOutlineArrowBackIos />
                    </div>

                    {currentChat.type === 'Friend' ? <div>
                        <span className={styles.des}>
                            <Link to={`/profile/${friend[0]._id}`} >{friend[0].fullname}</Link>
                        </span>
                    </div> : 
                    <div>
                        <span className={styles.des}>
                        {width < 769 ? 
                            <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>: 
                            <b>{currentChat.name}</b>}
                        </span> 
                    </div>}

                    {/* // Fake div  */}
                    <div></div>
                </div>

                {/* // Render all chat  */}
                <div className={styles.chatContainer} >
                    {chats && chats.map((currChat, index, chat) => {
                        let dup = false
                        if (index > 0 && chat[index - 1].sender === currChat.sender) {
                            dup = true
                        }
                        return <ChatItem
                            key={currChat._id} 
                            self={currChat.sender === currentUser.id} 
                            data={currChat} 
                            setChats={setChats}
                            dup={dup}
                        />
                    })}
                    {pendingChat && <ChatLoading username={friend.find(u => u._id === sender)?.fullname  } />}
                    <div ref={bottomRef}></div>
                </div>
                {/* // From Chat  */}
                <ChatForm/>

                <Model isOpen={isOpen} heading="Nhóm" handleClick={setIsOpen}>
                    <GroupInfoTab />
                </Model>
            </div>}
            {currentChat && currentChat.type === 'Friend' ? 
                toggle && <FriendInfoTab /> :
                toggle && width > 769 ? <GroupInfoTab /> : null
            }
        </>
    )
}

export default Chats