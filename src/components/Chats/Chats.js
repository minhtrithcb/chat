import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from "./Chats.module.scss"
import avatar from '../../assets/images/user.png'
import { FiAlignRight } from "react-icons/fi";
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

const Chats = () => {
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
    const [offset, setOffset] = useState({count: 0, counting: false})
    const loadMoreRef = useRef()
    const oldScroll = useRef()
    // Listening even from socket
    useEffect(() => {        
        let isMounted = true;   
        // Get new msg in room
        socket.on("getMessage", data => {
            if (isMounted && data) {
                setChats(prevChat => [...prevChat, data]);
                // if someOne or CurrUser Texting the off set will count by one
                // And the counting flag will prevent user load more recode
                setOffset(prev => ({count: prev.count + 1, counting: true}))        
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

    // Scroll funtion
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
                    const {data} = await chatApi.getChatByRoomId(currentChat._id, offset.count)
                    if (isMounted) {
                        if (offset?.count === 0) {
                            setChats(data.reverse()); 
                            toTheBottom();
                        
                        // If not couting user will recive 20 record
                        } else if (!offset?.counting) {
                            let revs = data.reverse() // new value
                            // Push new value in front of array, and the ref (oldScroll) so user can stay with current postion
                            // The Prev value just remove the oldScroll
                            setChats(prev => [...revs, {oldScroll: true}, ...prev.filter(c => !c.oldScroll) ]); 
                            oldScroll?.current.scrollIntoView()
                        }
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
    }, [currentChat, offset])
    
    // Tracking user sroll to the top
    useEffect(() => {
          const observer = new IntersectionObserver(entries => {
              let entry = entries[0];
              //  boundingClientRect.top default is 70, this will prevent the offset increse the first time
              if(entry.isIntersecting && entry.boundingClientRect.top === 68){
                    // Every time user reach the top will get more 20 record
                    // The counting just trigger to get new record
                    setOffset(prev => ({count: prev.count + 20, counting: false}))        
              }
          },{
              root: null,
              threshold: 0,
              rootMargin: "0px"
          });
  
          const currTarget = loadMoreRef.current
          if(currTarget) observer.observe(currTarget);
  
          return () => {
              // Reset
              setOffset({count: 0, counting: false})
              if(currTarget) {
                  observer.unobserve(currTarget);
              }
          }
    },[currentChat])

    // Check is Friend
    const checkIsFriend = () => {
        return currentChat.type === 'Friend'
    }

    return (
        <>
            {!currentChat ? 
            <NotHaveChat />
            : <div className={classesDarkMode} >
                {/* // Desktop view  */}
                <div className={styles.friendCover}>
                    {checkIsFriend() ? <div>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="friend_avatar" />
                        </div>
                        <span className={styles.des}>
                            <b onClick={() => setIsOpen(true)}>{friend[0].fullname}</b>
                            <small>#{friend[0].email}</small>
                        </span>
                    </div> : 
                    <div>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="group_avatar" />
                        </div>
                        <span className={styles.des}>
                            <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>
                            <small>{currentChat.members.length} Thành viên</small>
                        </span>
                    </div>}
                    
                    {/* Open model  */}
                    <div onClick={() => setIsOpen(true)}>
                        <FiAlignRight /> 
                    </div>
                </div>
                {/* // Mobile View  */}
                <div className={styles.mobileViewCover}>
                    <div className={styles.goBackBtn} onClick={() => setCurrentChat(null)}>
                        <MdOutlineArrowBackIos />
                    </div>

                    {checkIsFriend() ? <div>
                        <span className={styles.des}>
                            <Link to={`/profile/${friend[0]._id}`} >{friend[0].fullname}</Link>
                        </span>
                    </div> : 
                    <div>
                        <span className={styles.des}>
                            <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>:
                        </span> 
                    </div>}

                    {/* // Fake div  */}
                    <div onClick={() => setIsOpen(true)}>
                        <FiAlignRight /> 
                    </div>
                </div>

                {/* // Render all chat  */}
                <div className={styles.chatContainer} >
                    <div ref={loadMoreRef}></div>
                    {chats && chats.map((currChat, index, chat) => {
                        let dup = false
                        if (index > 0 && chat[index - 1].sender === currChat.sender) {
                            dup = true
                        }
                        if (currChat.oldScroll) {
                            return <div key={currChat.oldScroll} ref={oldScroll}></div>
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

                <Model isOpen={isOpen} heading={checkIsFriend()? "Bạn bè": "Nhóm"} handleClick={setIsOpen}>
                    {checkIsFriend() ? <FriendInfoTab />:  <GroupInfoTab />}
                </Model>
            </div>}
        </>
    )
}

export default Chats