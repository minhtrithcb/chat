import React, {  useContext, useEffect, useState } from 'react'
import styles from './ConversationItem.module.scss'
import clsx from 'clsx'
import useTheme from '../../hooks/useTheme'
import { SocketContext } from '../../context/SocketContext'
import {ConversationItemLoading} from '../ChatLoading/ChatLoading'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import renderSubString, { renderTimeDiff } from '../../helper/renderSubString'
import { ChatContext } from '../../context/ChatContext'
import Avatar from '../Common/Avatar/Avatar'
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import Dropdown, {DropdownItem} from '../Common/Dropdown/Dropdown'

const ConversationItem = ({activeChat , conversation, members, usersOnline}) => {
    const {socket} = useContext(SocketContext)
    const {userReadConver, setChatsOption} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const [pendingChat, setPendingChat] = useState(false)
    const {theme, themeConver} = useTheme()
    const [lastMsg, setLastMsg] = useState(conversation.lastMsg)
    const [onlineFriend, setOnlineFriend] = useState(false)
    const [unReadMsg, setUnReadMsg] = useState(0)
    const classesDarkMode = clsx(styles.messagesItem,{ 
        [styles.dark]: theme === "dark",
        [styles.themeDefault]: themeConver === "default",
        [styles.themeSimple]: themeConver === "simple",
        [styles.active]: activeChat,
    })

    // Get new message & display
    useEffect(() => {        
        let isMounted = true;            

        // Get and display new msg
        socket.on("getSomeOneMessage", data => {
            if (data.roomId === conversation._id) {
                setLastMsg(data);
                // count by one if someone text
                if (data.sender !== currentUser.id) {
                    setUnReadMsg(prev => prev + 1)
                }
            }
        })
        // Get and display new update last msg ex: recall last msg > display "Tin nhắn đã bị thu hồi"
        socket.on("getLastActivity", ({result, room}) => {
            if (result?.roomId === conversation._id && 
                room?._id === result?.roomId) {
                    setLastMsg(result);
            }
        })

        // // Event pending
        socket.on("getPendingByFriend", ({roomId, reciverId}) => {
            if (isMounted && roomId === conversation?._id &&
                reciverId === currentUser.id
                ) {
                setPendingChat(true)
            }
        })
        // // // Event stop pending
        socket.on("stopPendingByFriend", data => {
            if (isMounted && data) {
                setPendingChat(false)
            }
        })

        return () => { isMounted = false };

    }, [socket, conversation, currentUser.id])

    // set state users online
    useEffect(() => {
        if(usersOnline !== undefined) {
            let res = usersOnline?.find(u => u.uid === members[0]?._id)
            if(res !== undefined) setOnlineFriend(true) 
        }
        return () => {
            setOnlineFriend(false)
        }
    },[usersOnline, members])    

    // Set unread default 0 
    useEffect(() => {
        const found = conversation?.readBy.find(u => u._id === currentUser.id) 
        setUnReadMsg(found?.count ?? 0)
    }, [conversation, currentUser.id])
    
    // Set unread if user chose converstion
    useEffect(() => {
        if(userReadConver?._id === conversation?._id) setUnReadMsg(0)
    }, [userReadConver, conversation._id])
    
    // Render fullname
    const renderNameInGroup = () => {
        if(lastMsg.sender === currentUser.id) return "Bạn"
        return members.find(u => u._id === lastMsg.sender)?.fullname.slice(0,6)
    }

    // Check user banned
    const checkUserIsBanned = () => {
        return conversation?.membersBanned.find(u => u._id === currentUser.id)
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
        if (found) return JSON.parse(found).includes(conversation._id)
        return false
    }

    return (
        <>
        {/* // Friend conversation */}
            {conversation.type === 'Friend' ? <div className={classesDarkMode}>
                <span>
                    <Avatar 
                        letter={members[0].fullname.charAt(0)} 
                        isOnline={onlineFriend}
                    />
                </span>
                {onlineFriend ?
                    <div className={styles.box}>
                        <span className={styles.isOnline}></span>
                    </div>:
                    <div className={styles.box}>
                        <span className={styles.isOffline}></span>
                    </div>
                }
                <span className={styles.textMsg}>
                    <b title={members[0].fullname}>{renderSubString(members[0].fullname, 15)}</b>
                    
                    {lastMsg && !lastMsg.reCall ? 
                        <p>{ lastMsg.sender === currentUser.id && "Bạn :" } {renderSubString(lastMsg.text, 11)} </p>:
                        lastMsg?.reCall && <p className={styles.italic}>{renderSubString("Tin nhắn đã bị thu hồi", 11)}</p>
                    }
                </span>
                <span>
                    <small>{lastMsg && renderTimeDiff(lastMsg.createdAt)}</small>
                    <span>
                        {pendingChat && <ConversationItemLoading />}
                        { unReadMsg !== 0 && <p> {unReadMsg}</p>}
                    </span> 
                </span>
                <Dropdown position="right" >
                    <DropdownItem
                        onClick={() => pinConvertation(conversation)}
                    >
                        {!CheckPin() ? 'Ghim' : 'Bỏ Ghim'}
                    </DropdownItem>
                </Dropdown>
            </div> :
            // Group conversation
            <div className={classesDarkMode}>
                <span>
                    <Avatar 
                        letter={conversation.name.charAt(0)} 
                    />
                </span>
                <div className={styles.box}>
                    <span className={styles.isNull}></span>
                </div>
                <span className={styles.textMsg}>
                    <b title={conversation.name}>{renderSubString(`${conversation.name}`,15)}
                    {conversation.private ? 
                        <AiOutlineLock style={{color: '#ff7675'}} title="Công khai" />  :                  
                        <AiOutlineUnlock title='Riêng tư' />}
                     </b>
                    {!checkUserIsBanned() ? 
                        // if not ban
                        (lastMsg && !lastMsg.reCall ? 
                        <p> 
                            {renderNameInGroup()}
                            {`: ${renderSubString(lastMsg.text, 11)}`} 
                        </p>:
                        lastMsg?.reCall && 
                        <p className={styles.italic}>
                            {renderSubString("Tin nhắn đã bị thu hồi", 11)}
                        </p>) : 
                        // if Banned
                        <p className={styles.italic}>
                            Bạn đã bị cấm chat    
                        </p>

                    }
                </span>
                <span>
                    <small>{!checkUserIsBanned() && lastMsg && renderTimeDiff(lastMsg.createdAt)}</small>
                    <span>
                        {!checkUserIsBanned() && pendingChat && <ConversationItemLoading />}
                        {!checkUserIsBanned() && unReadMsg !== 0 && <p> {unReadMsg}</p>}
                    </span> 
                </span>
                <Dropdown position="right" >
                    <DropdownItem
                        onClick={() => pinConvertation(conversation)}
                    >
                        {!CheckPin() ? 'Ghim' : 'Bỏ Ghim'}
                    </DropdownItem>
                </Dropdown>
            </div> }
        </>
    )
}

export default ConversationItem 