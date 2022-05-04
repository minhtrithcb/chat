import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from "./Chats.module.scss"
import { FiAlignRight } from "react-icons/fi";
import { MdOutlineArrowBackIos } from "react-icons/md";
import clsx from 'clsx';
import useToggle from '../../hooks/useToggle';
import useTheme  from '../../hooks/useTheme'
import chatApi from '../../api/chatApi';
import { ChatContext } from '../../context/ChatContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import ChatItem from '../ChatItem/ChatItem';
import ChatForm from '../ChatForm/ChatForm';
import { SocketContext } from '../../context/SocketContext';
import { Link } from 'react-router-dom';
import ChatLoading from '../ChatLoading/ChatLoading';
import FriendInfoTab from '../FriendInfoTab/FriendInfoTab';
import GroupInfoTab from '../GroupInfoTab/GroupInfoTab';
import Model from '../Common/Model/Model';
import Avatar from '../Common/Avatar/Avatar'

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
    const [firstLoad, setFirstLoad] = useState(false)

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

    // Tracking user sroll to the top
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            let entry = entries[0];
            if(entry.isIntersecting && firstLoad) {
                  // Every time user reach the top will get more 20 record
                  // The counting just trigger to get new record
                //   console.log("Reach the top");
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
            // reset 
            if(currTarget) {
                if(offset.count !== 0) setOffset({count: 0, counting: false})
                if(firstLoad) setFirstLoad(false)
                observer.unobserve(currTarget);
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentChat, firstLoad])

    
    // Fetch all chat by id conversation
    useEffect(() => {
        let isMounted = true;   
        const getChats = async () => {
            try {
                if (isMounted) {
                    const {data} = await chatApi.getChatByRoomId(currentChat._id, offset.count)
                    if (offset.count === 0 && offset.counting === false) {
                        let revs = data.reverse() // new value
                        setChats(revs); 
                        bottomRef?.current?.scrollIntoView()
                        setFirstLoad(true)
                        // console.log("set chat 1st",currentChat?._id, offset.count);
                    // If not couting user will recive 20 record
                    } else if (offset.count > 0 && offset.counting === false) {
                        let revs = data.reverse() // new value
                        // Push new value in front of array, and the ref (oldScroll) so user can stay with current postion
                        // The Prev value just remove the oldScroll
                        setChats(prev => [...revs, {oldScroll: true}, ...prev.filter(c => !c.oldScroll) ]); 
                        oldScroll?.current?.scrollIntoView()
                        // console.log("set chat n ....",currentChat?._id,  offset.count);
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
    
    

    // Check is Friend
    const checkIsFriend = () => {
        return currentChat.type === 'Friend'
    }

    return (
        <div className={classesDarkMode} >
            {/* // Desktop view  */}
            <div className={styles.friendCover}>
                {checkIsFriend() ? <div>
                    <Avatar 
                        letter={friend[0].fullname.charAt(0)} 
                    />
                    <span className={styles.des}>
                        <b onClick={() => setIsOpen(true)}>{friend[0].fullname}</b>
                        <small>#{friend[0].email}</small>
                    </span>
                </div> : 
                <div>
                    <Avatar 
                        letter={currentChat.name.charAt(0)} 
                    />
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
                        <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>
                    </span> 
                </div>}

                {/* // Fake div  */}
                <div onClick={() => setIsOpen(true)}>
                    <FiAlignRight /> 
                </div>
            </div>

            {/* // Render all chat  */}
            <div className={styles.chatContainer} >
                {firstLoad && <div ref={loadMoreRef}></div>}
                {chats && chats.map((currChat, index, chat) => {
                    let dup = false
                    if (index > 0 && chat[index - 1].sender === currChat.sender && chat[index - 1].type === currChat.type) {
                        dup = true
                    }
                    if (currChat.oldScroll) {
                        return chats.length > 20 && <div className={styles.notifyMsg} key={currChat.oldScroll} ref={oldScroll}>
                             <p>{offset.count < chats.length ? "Tin cũ hơn" : "Đã hết tin nhắn"}</p>
                        </div>
                    }
                    if (currChat.type === 'Notify') {
                        return <div className={styles.notifyMsg} key={currChat._id}>
                             <p>{currChat.text}</p>
                        </div>
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
        </div>
    )
}

export default Chats