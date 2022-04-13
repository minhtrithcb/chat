import clsx from 'clsx'
import moment from 'moment'
import 'moment/locale/vi'
import React, {  useContext } from 'react'
import avatar from '../../assets/images/user.png'
import { ChatContext } from '../../context/ChatContext'
import useTheme  from '../../hooks/useTheme'
import styles from "./ChatItem.module.scss"
import Reaction, { ReactionRender } from '../Reaction/Reaction'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown'
import useDecodeJwt from '../../hooks/useDecodeJwt';
import chatApi from '../../api/chatApi'
import { SocketContext } from '../../context/SocketContext'

const ChatItem = ({self, data}) => {
    const {theme} = useTheme()
    const {friend, setChatEdit, chatEdit, currentChat} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.chatItem,{ 
        [styles.dark]: theme === "dark",
        [styles.isEdit]: chatEdit !== null && chatEdit._id === data._id
    })

    const classes2DarkMode = clsx(styles.chatItem2,{ 
        [styles.dark]: theme === "dark",
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
        console.log(chat);
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
        socket.emit("sendLastActivity", { friendId: friend._id , ...res.data})
    }



    return (
        <>
            {
            self ? 
            // Self 
            <div className={classesDarkMode}>
                <div className={styles.chatAvatar}>
                    <div className={styles.avatar}>
                        <img src={avatar} alt="avatar" />
                    </div>
                </div>
                
                <div className={styles.chatDes}>
                    <div className={styles.chatInfo}>
                        <b>Bạn</b>
                        <small>{moment(data.createdAt).fromNow()}</small>
                    </div>
                    <div className={styles.chatText}>
                        <div>
                            <p>
                                {!data.reCall ? data.text : <i>Tin nhắn đã bị thu hồi</i>}
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
            <div className={classes2DarkMode}>                
                <div className={styles.chatDes}>
                    <div className={styles.chatInfo}>
                        <small>{moment(data.createdAt).fromNow()}</small>
                        <b>{friend.fullname}</b>
                    </div>
                    <div className={styles.chatText}>
                        <div>
                            <p>{!data.reCall ? data.text : <i>Tin nhắn đã bị thu hồi</i> }</p>
                            { data.reacts.length > 0  && 
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
                        <span className={styles.chatEmoji} >
                            <Reaction float="floatRight"  handleClickReaction={onChose} />
                        </span>
                        <span className={styles.chatOption}>
                            <Dropdown >
                                <DropdownItem onClick={() => handleReply(data)}>Trích lời</DropdownItem>
                            </Dropdown>
                        </span>
                    </div>
                    { data.isEdit && <small>Đã chỉnh sửa</small>}
                </div>
                <div className={styles.chatAvatar}>
                    <div className={styles.avatar}>
                        <img src={avatar} alt="avatar" />
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default ChatItem