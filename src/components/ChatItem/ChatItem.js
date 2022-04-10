// import clsx from 'clsx'
import moment from 'moment'
import 'moment/locale/vi'
import React, {  useContext, useEffect, useState } from 'react'
import avatar from '../../assets/images/user.png'
import { ChatContext } from '../../context/ChatContext'
// import useTheme  from '../../hooks/useTheme'
import styles from "./ChatItem.module.scss"
import Reaction, { ReactionRender } from '../Reaction/Reaction'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown'
import useDecodeJwt from '../../hooks/useDecodeJwt';
import chatApi from '../../api/chatApi'
// import { SocketContext } from '../../context/SocketContext'

const ChatItem = ({self, data}) => {
    // const {theme} = useTheme()
    const {friend} = useContext(ChatContext)

    // const classesDarkMode = clsx(styles.chatItem,{ 
    //     [styles.dark]: theme === "dark"
    // })
    const { setCurrentChatItem } = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const [count, setCount] = useState([])

    const onChose = async (e) => {
        let res = await chatApi.postReaction(data._id, currentUser, e)
        // setCurrentChatItem(prev => [...prev, res.data.found])
        setCurrentChatItem(res.data.found)
    }
    

    useEffect(() => {
        if(data.reacts.length > 0) {
            const counts = {};
            const arr = [];
            // return new arr ex["like", "like", "wow"]
            data.reacts.map(r => r.type).forEach(r => { 
               counts[r] = (counts[r] || 0) + 1 
            });

            for (const key in counts) {
                arr.push({type: key, number: counts[key]});
            }

            setCount(arr)
        }
    }, [data.reacts])
    

    return (
        <>
            { self ? 
            // Self 
            <div className={styles.chatItem}>
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
                                {count && count.map((react, i) => (
                                    <ReactionRender type={react.type} number={react.number} key={i} />
                                ))}
                            </div>}
                        </div>
                        <span className={styles.chatEmoji} >
                            <Reaction float="floatLeft" handleClickReaction={onChose} />
                        </span>
                        <span className={styles.chatOption}>
                            <Dropdown positionUl="right">
                                <DropdownItem>Trả lời</DropdownItem>
                                <DropdownItem>Chia sẻ</DropdownItem>
                                <DropdownItem>Ẩn tin</DropdownItem>
                            </Dropdown>
                        </span>
                    </div>
                </div>
            </div>:  
            // Friend
            <div className={styles.chatItem2}>                
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
                                {count && count.map((react, i) => (
                                    <ReactionRender type={react.type} number={react.number} key={i} />
                                ))}
                            </div>}
                        </div>
                        <span className={styles.chatEmoji} >
                            <Reaction float="floatRight"  handleClickReaction={onChose} />
                        </span>
                        <span className={styles.chatOption}>
                            <Dropdown >
                                <DropdownItem>Trả lời</DropdownItem>
                                <DropdownItem>Chia sẻ</DropdownItem>
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