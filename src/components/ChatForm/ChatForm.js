import clsx from 'clsx';
import React, { useContext, useState } from 'react'
import { BsEmojiSmile } from "react-icons/bs";
import { TiLocationArrow } from "react-icons/ti";
import chatApi from '../../api/chatApi';
import { ChatContext } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import useTheme from '../../hooks/useTheme';
import styles from './ChatForm.module.scss'
import Picker from 'emoji-picker-react';

const ChatForm = () => {
    const [inputChat, setInputChat] = useState("")
    const {currentChat} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const [toggle, setToggle] = useState(false)
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const classesDarkMode = clsx(styles.chatForm,{ 
        [styles.dark]: theme === "dark"
    })
    const friendId = currentChat.members.find(u => u !== currentUser.id)

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        console.log(event, emojiObject);
    };

    // Submit send message
    const handleSubmit = async () => {
        if (inputChat !== "") {
            try {
                const {data} = await chatApi.postNewChat({
                    roomId: currentChat._id,
                    sender: currentUser.id,
                    text:   inputChat,
                })
                // Send to socket room
                socket.emit("send-msg", data)
                // Send to socket id
                socket.emit("sendToFriendOnline", { friendId , ...data})
                setInputChat("")
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Ctrl + enter = submit msg
    const handleCtrlEnter = e => {
        if (e.ctrlKey && e.keyCode === 13) {
            handleSubmit();
        }
    }

    return (
        <div className={classesDarkMode} >
            <textarea 
                placeholder='Write something ...'
                value={inputChat} 
                onKeyDown={handleCtrlEnter}
                onChange={(e) => setInputChat(e.target.value)}
            ></textarea>
            <small>Bấm Ctrl + Enter để gửi</small>
            <div className={styles.emote} >
                <BsEmojiSmile/>
            </div>
            <div className={styles.sendBtn} onClick={handleSubmit}>
                <TiLocationArrow/>
            </div>
            <Picker 
                disableSearchBar={true}
                onEmojiClick={onEmojiClick} 
                pickerStyle={{marginLeft: 'auto'}} 
                groupVisibility={{
                    recently_used: false,
                }}
            />
        </div> 
    )
}

export default ChatForm