import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from "./Chats.module.scss"
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
import ChatLoading from '../ChatLoading/ChatLoading';
import FriendInfoTab from '../FriendInfoTab/FriendInfoTab';
import GroupInfoTab from '../GroupInfoTab/GroupInfoTab';
import Model from '../Common/Model/Model';
import Avatar from '../Common/Avatar/Avatar'
import MasterGroupOption from '../MasterGroupOption/MasterGroupOption';
import moment from 'moment';
import converApi from '../../api/converApi';
import renderSubString from '../../helper/renderSubString';
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown';

const Chats = () => {
    const [isOpen, setIsOpen] = useToggle(false)
    const [pendingChat, setPendingChat] = useToggle(false)
    const [sender, setSender] = useState('')
    const [chats, setChats] = useState([])
    const bottomRef = useRef()
    const {currentChat, friend, setCurrentChat, setChatsOption} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.conversation,{ 
        [styles.dark]: theme === "dark",

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

    // Check user is ban
    const checkUserIsBanned = useCallback(() => {
        return currentChat?.membersBanned.find(u => u._id === currentUser.id)
    }, [currentChat, currentUser.id])

    // Check time to unban
    useEffect(() => {
        const checkTimeUnban = async () => {
            const userBan = currentChat?.membersBanned.find(u => u._id === currentUser.id)
            if (Date.parse(userBan?.time) < Date.now()) {
                const {data} = await converApi.unBanUser({
                    roomId: currentChat._id, 
                    memberId: userBan._id
                })

                if (data?.success) {
                    setChatsOption({type:  'All', title: 'Tất cả tin nhắn'})
                    setCurrentChat(data?.result)
                }
            }
        }
        checkTimeUnban()
        // return () => {}
    }, [currentChat, currentUser.id, setCurrentChat, setChatsOption])
    

    // Fetch all chat by id conversation
    useEffect(() => {
        let isMounted = true;   
        const getChats = async () => {
            try {
                const found = currentChat?.membersBanned.find(u => u._id === currentUser.id)
                if (isMounted && !found) {
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
                }   else setChats([])
            } catch (error) {
                console.log(error);
            }
        }
        getChats()
        return () => { 
            isMounted = false 
        };
    }, [currentChat, offset, currentUser.id])
    
    // Check is Friend
    const checkIsFriend = () => {
        return currentChat.type === 'Friend'
    }

   // Pin convertation
   const pinConvertation = (conver) => {
        const found = localStorage.getItem('listPin')
        if (!found) {
            let listPin = []
            listPin.push(conver._id)
            localStorage.setItem('listPin',JSON.stringify(listPin))    
        } else {
            let listPin = JSON.parse(found)
            if (!listPin.includes(conver._id)) {
                listPin.push(conver._id)
                localStorage.setItem('listPin', JSON.stringify(listPin))    
            } else {
                let newList = listPin.filter(id => id !== conver._id)
                localStorage.setItem('listPin', JSON.stringify(newList))    
            }
        }
        setChatsOption({type:  'All', title: 'Tất cả tin nhắn'})
    }

    // Check convesation is pin
    const CheckPin = () => {
        const found = localStorage.getItem('listPin')
        if (found) return JSON.parse(found).includes(currentChat._id)
        return false
    }

    return (
        <div className={classesDarkMode} >
            {/* // Desktop view  */}
            <div className={styles.cover}>
                <div>
                    {checkIsFriend() ?  <Avatar 
                      letter={friend[0].fullname.charAt(0)} 
                    />:
                     <Avatar 
                        letter={currentChat.name.charAt(0)} 
                    />}
                    <span className={styles.des}>
                       { checkIsFriend() ? 
                        <>
                            <b onClick={() => setIsOpen(true)}>{friend[0].fullname}</b>
                            <small>#{friend[0].email}</small> 
                        </>
                        :
                        <>
                        <b onClick={() => setIsOpen(true)}>{currentChat.name}</b>
                        <small>{currentChat.members.length} Thành viên</small>
                        </>}
                    </span>
                </div> 
                {/* Open model  */}
                {!checkIsFriend() && <MasterGroupOption />}
                <Dropdown >
                    <DropdownItem onClick={() => setIsOpen(true)}>
                        Thông tin
                    </DropdownItem>
                    <DropdownItem
                        onClick={() => pinConvertation(currentChat)}
                    >
                        {!CheckPin() ? 'Ghim' : 'Bỏ Ghim'}
                    </DropdownItem>
                </Dropdown>
            </div>
            {/* // Mobile View  */}
            <div className={styles.mobileViewCover}>
                <div className={styles.goBackBtn} onClick={() => setCurrentChat(null)}>
                    <MdOutlineArrowBackIos />
                </div>
                <span className={styles.mobileDes}>
                    { checkIsFriend() ? 
                    <>
                        <b onClick={() => setIsOpen(true)}>{renderSubString(friend[0].fullname, 20)}</b>
                        <small>#{friend[0].email}</small> 
                    </>
                    :
                    <>
                    <b onClick={() => setIsOpen(true)}>{renderSubString(currentChat.name, 20)}</b>
                    <small>{currentChat.members.length} Thành viên</small>
                    </>}
                </span>
                {/* Open model  */}
                {!checkIsFriend() && <MasterGroupOption />}
                <Dropdown >
                    <DropdownItem onClick={() => setIsOpen(true)}>
                        Thông tin
                    </DropdownItem>
                </Dropdown>
            </div>

            {/* // Render all chat  */}
            <div className={styles.chatContainer} >
                {firstLoad && <div ref={loadMoreRef}></div>}
                {
                    checkUserIsBanned()  &&  
                        <div className={styles.notifyMsg}>
                             <p>Bạn dã bị cấm chat đến ngày 
                                {` ${moment(checkUserIsBanned().time).format('DD/MM/YYYY')} `}
                                vì lý do {checkUserIsBanned().reason}
                            </p>
                        </div>
                }
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
            {!checkUserIsBanned()  && <ChatForm/>}

            <Model isOpen={isOpen} heading={checkIsFriend()? "Bạn bè": "Nhóm"} handleClick={setIsOpen}>
                {checkIsFriend() ? <FriendInfoTab />:  <GroupInfoTab />}
            </Model>

        </div>
    )
}

export default Chats