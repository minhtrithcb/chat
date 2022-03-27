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

const ChatForm = () => {
    const [inputChat, setInputChat] = useState("")
    const {currentChat} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)

    const classesDarkMode = clsx(styles.chatForm,{ 
        [styles.dark]: theme === "dark"
    })

    // Submit send message
    const handleSubmit = async () => {
        if (inputChat !== "") {
            try {
                const {data} = await chatApi.postNewChat({
                    roomId: currentChat._id,
                    sender: currentUser.id,
                    text:   inputChat,
                })
                // Send to socket server
                socket.emit("send-msg", data)
                setInputChat("")
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className={classesDarkMode} >
            <textarea 
                placeholder='Write something ...'
                value={inputChat} 
                onChange={(e) => setInputChat(e.target.value)}
            ></textarea>
            <div className={styles.emote}>
                <BsEmojiSmile/>
            </div>
            <div className={styles.sendBtn} onClick={handleSubmit}>
                <TiLocationArrow/>
            </div>
        </div> 
    )
}

export default ChatForm