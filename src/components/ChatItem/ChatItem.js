import clsx from 'clsx'
import React, {  useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import useTheme  from '../../hooks/useTheme'
import styles from "./ChatItem.module.scss"
import Reaction, { ReactionRender } from '../Reaction/Reaction'
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown'
import useDecodeJwt from '../../hooks/useDecodeJwt';
import chatApi from '../../api/chatApi'
import { SocketContext } from '../../context/SocketContext'
import { renderTimeDiff } from '../../helper/renderSubString'
import Avatar from '../Common/Avatar/Avatar'

const ChatItem = ({self, data, dup}) => {
    const {theme} = useTheme()
    const {friend, setChatEdit, chatEdit, currentChat, setChatReply, reciverLeaveGroup} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.chatItem,{ 
        [styles.dark]: theme === "dark",
        [styles.isEdit]: chatEdit !== null && chatEdit._id === data._id,
        [styles.dup]: dup
    })

    const classes2DarkMode = clsx(styles.chatItem2,{ 
        [styles.dark]: theme === "dark",
        [styles.dup]: dup
    })

    //User send reaction
    const onChose = async (e) => {
        let res = await chatApi.postReaction({
            chatId :data._id,
            user: { 
                username: currentUser.username, 
                id: currentUser.id
            }, 
            type: e
        })
        //send into room
        socket.emit("sendChangeChat", res.data.result)
    }

    //User edit own chat 
    const handleEditChat = (chat) => {
        setChatEdit(chat);
    }

    //User reply own chat 
    const handleReply = (chat) => {
        setChatReply(chat)
    }

    //User reCall own chat 
    const handleReCallChat = async (chat) => {
        let res = await chatApi.reCallChat({
            roomId: currentChat._id,
            chatId : chat._id,
            sender: currentUser.id
        })

        //send into room
        socket.emit("sendChangeChat", res.data.result)
        //send backto change lastmsg if this is lastmsg
        socket.emit("sendLastActivity", { recivers: friend , ...res.data})
    }

    // Render friend fullname
    const renderFullname = (data) => {
        let members
        if (reciverLeaveGroup.length !== 0) {
            members = [...friend, ...reciverLeaveGroup]
        } else members = [...friend]
        return data === currentUser.id ? "Bạn" :
        members.find(u => u._id === data)?.fullname  
    }

    return (
        <>
            {
            self ? 
            // Self 
            <div className={classesDarkMode}>
                <div className={styles.chatAvatar}>
                    {!dup && <Avatar 
                        size={'sm'}
                        letter={currentUser.username.charAt(0)} 
                    />   }             
                </div>
                <div className={styles.chatDes}>
                    {!dup && <div className={styles.chatInfo}>
                        <b>Bạn</b> 
                        <small>{renderTimeDiff(data.createdAt)}</small>
                    </div>}
                    <div className={styles.chatText}>
                        <div>
                            {data.replyMsg && <div className={styles.chatTextReply}>
                                <b>{renderFullname(data.replyMsg.sender)}</b>
                                <small>{renderTimeDiff(data.replyMsg.createdAt)}</small>
                                <p>{data.replyMsg.text}</p>
                            </div>}
                            <p>
                                {!data.reCall ? data.text : <i>Tin nhắn đã bị thu hồi</i>}
                                {dup && <small>{renderTimeDiff(data.createdAt)}</small>}
                            </p>
                            {!data.reCall && data.reacts.length > 0  && 
                            <div className={styles.reactionWraper}>
                                {data.reacts.map((react, i) => (
                                    <ReactionRender 
                                        type={react.type} 
                                        number={react.user.length} 
                                        users={react.user} 
                                        key={i} 
                                    />
                                ))}
                            </div>}
                        </div>
                        {!data.reCall && <span className={styles.chatEmoji} >
                            <Reaction float="floatLeft" handleClickReaction={onChose} />
                        </span> }
                       {!data.reCall && <span className={styles.chatOption}>
                            <Dropdown positionUl="right">
                                <DropdownItem onClick={() => handleReply(data)}>Trích lời</DropdownItem>
                                <DropdownItem onClick={() => handleEditChat(data)}>Chỉnh sửa</DropdownItem>
                                <DropdownItem onClick={() => handleReCallChat(data)}>Thu hồi</DropdownItem>
                            </Dropdown>
                        </span>}
                    </div>
                    { data.isEdit && <small>Đã chỉnh sửa</small>}
                </div>
            </div>:  
            // Friend
            <div className={classes2DarkMode} >                
                <div className={styles.chatDes}>
                    {!dup && <div className={styles.chatInfo}>
                        <small>{renderTimeDiff(data.createdAt)}</small>
                        <b>{renderFullname(data.sender) }</b>
                    </div> }
                    <div className={styles.chatText}>
                        <div>
                            {data.replyMsg && <div className={styles.chatTextReply}>
                                <b>{renderFullname(data.replyMsg.sender)}</b>
                                <small>{renderTimeDiff(data.replyMsg.createdAt)}</small>
                                <p>{data.replyMsg.text}</p>
                            </div>}
                            <p>
                                {dup && <small>{renderTimeDiff(data.createdAt)}</small>}
                                {!data.reCall ? data.text : <i>Tin nhắn đã bị thu hồi</i> }
                            </p>
                            { !data.reCall && data.reacts.length > 0  && 
                            <div className={styles.reactionWraper}>
                                {data.reacts.map((react, i) => (
                                    <ReactionRender 
                                        type={react.type} 
                                        number={react.user.length} 
                                        users={react.user} 
                                        key={i} 
                                    />
                                ))}
                            </div>}
                        </div>
                        {!data.reCall &&  <span className={styles.chatEmoji} >
                            <Reaction float="floatRight"  handleClickReaction={onChose} />
                        </span> }
                        {!data.reCall && <span className={styles.chatOption}>
                            <Dropdown >
                                <DropdownItem onClick={() => handleReply(data)}>Trích lời</DropdownItem>
                            </Dropdown>
                        </span>}
                    </div>
                    { data.isEdit && <small>Đã chỉnh sửa</small>}
                </div>
                <div className={styles.chatAvatar}>
                    {!dup && <Avatar 
                        size={'sm'}
                        letter={renderFullname(data.sender)?.charAt(0)} 
                    /> }  
                </div>
            </div>
            }
        </>
    )
}

export default ChatItem