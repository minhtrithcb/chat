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
    const {friend, setChatEdit, chatEdit} = useContext(ChatContext)
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
        socket.emit("send-reaction", res.data.result)
    }

    //User edit own chat 
    const handleEditChat = (chat) => {
        setChatEdit(chat);
    }

    return (
        <>
            { self ? 
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
                            <p>{data.text}</p>
                            { data.reacts.length > 0  && 
                            <div className={styles.reactionWraper}>
                                {data.reacts.map((react, i) => (
                                    <ReactionRender 
                                        type={react.type} 
                                        number={react.user.length} 
                                        users={react.user} 
                                        key={i} />
                                ))}
                            </div>}
                        </div>
                        <span className={styles.chatEmoji} >
                            <Reaction float="floatLeft" handleClickReaction={onChose} />
                        </span>
                        <span className={styles.chatOption}>
                            <Dropdown positionUl="right">
                                <DropdownItem>Trích lời</DropdownItem>
                                <DropdownItem onClick={() => handleEditChat(data)}>Chỉnh sửa</DropdownItem>
                                <DropdownItem>Ẩn tin</DropdownItem>
                            </Dropdown>
                        </span>
                    </div>
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
                            <p>{data.text}</p>
                            { data.reacts.length > 0  && 
                            <div className={styles.reactionWraper}>
                                {data.reacts.map((react, i) => (
                                    <ReactionRender 
                                        type={react.type} 
                                        number={react.user.length} 
                                        users={react.user} 
                                        key={i} />
                                ))}
                            </div>}
                        </div>
                        <span className={styles.chatEmoji} >
                            <Reaction float="floatRight"  handleClickReaction={onChose} />
                        </span>
                        <span className={styles.chatOption}>
                            <Dropdown >
                                <DropdownItem>Trích lời</DropdownItem>
                                {/* <DropdownItem>Chia sẻ</DropdownItem> */}
                                <DropdownItem>Ẩn tin</DropdownItem>
                            </Dropdown>
                        </span>
                    </div>
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