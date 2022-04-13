import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsEmojiSmile } from "react-icons/bs";
import { TiLocationArrow } from "react-icons/ti";
import chatApi from '../../api/chatApi';
import { ChatContext } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import useTheme from '../../hooks/useTheme';
import styles from './ChatForm.module.scss'
// import Picker from 'emoji-picker-react';
import useOutside from '../../hooks/useOutside';

import { Picker } from 'emoji-mart'

const ChatForm = () => {
    const {currentChat, friend, chatEdit, setChatEdit} = useContext(ChatContext)
    const [inputChat, setInputChat] = useState('')
    const [isEditChat, setisEditChat] = useState(false)
    const [currentUser] = useDecodeJwt()
    const [toggle, setToggle] = useState(false)
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)
    const editFormRef = useRef(null)

    const classesDarkMode = clsx(styles.chatForm,{ 
        [styles.dark]: theme === "dark",
        [styles.isEditChat]: isEditChat === true
    })

    // When User chose edit chat
    useEffect(() => {
        if (chatEdit !== null) {
            // Set input field = edit text
            setInputChat(chatEdit.text)
            // enble edit text area
            setisEditChat(true)
            // Focus that area
            editFormRef.current.focus()
        }
        return () => {
            setInputChat('')
            setisEditChat(false)
        }
    }, [chatEdit])
    

    // Click outside to close
    const emojiDiv = useRef(null)
    useOutside(emojiDiv, () => {
        setToggle(false)
    })

    // Reset input
    useEffect(() => {
     setToggle(false)
     setInputChat('')
    }, [currentChat])

    // Handle chose emoji
    const onEmojiClick = (emojiObject) => {
        setInputChat(input => `${input} ${emojiObject.native}`)
    };

    // Submit send message
    const handleSubmit = async () => {
        if (inputChat !== "") {
            try {
                // If user not edit post new chat
                if (!isEditChat) {
                    const {data} = await chatApi.postNewChat({
                        roomId: currentChat._id,
                        sender: currentUser.id,
                        text:   inputChat,
                    })
                    // Send to socket room
                    socket.emit("send-msg", data)
                    // Send to socket id
                    socket.emit("sendToFriendOnline", { friendId: friend._id , ...data})
                    setInputChat("")

                // If user edit patch that chat
                } else {

                    const {data} = await chatApi.patchChat({
                        roomId: currentChat._id,
                        chatId: chatEdit._id,
                        sender: currentUser.id,
                        text:   inputChat,
                    })

                    // Send into room
                    socket.emit("sendChangeChat", data.result)
                    //send backto change lastmsg if this is lastmsg
                    socket.emit("sendLastActivity", { friendId: friend._id , ...data})

                    setisEditChat(false)
                    setChatEdit(null)
                    setInputChat("")
                }
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

    // Stop editing
    const handleStopEdit = e => {
        setisEditChat(false)
        setChatEdit(null)
    }

    return (
        <div className={classesDarkMode} >
            <textarea 
                placeholder={!isEditChat ? `Hãy nhập gì đó ...` : `Sửa lại chat ...`}
                value={inputChat} 
                onKeyDown={handleCtrlEnter}
                onChange={(e) => setInputChat(e.target.value)}
                ref={editFormRef}
            ></textarea>
            {!isEditChat && <small>Bấm Ctrl + Enter để gửi</small>}
            {isEditChat && <>
                <small>Bạn đang chỉnh sửa (Bấm Ctrl + Enter để gửi)</small>
                <button className={styles.btnClose} onClick={handleStopEdit}>Bỏ chỉnh sửa</button>
            </>}
            <div className={styles.emote} onClick={() => {setToggle(prev => !prev)}}>
                <BsEmojiSmile/>
            </div>
            <div className={styles.sendBtn} onClick={handleSubmit}>
                <TiLocationArrow/>
            </div>
            <div ref={emojiDiv} className={styles.renderPiker}>
                {toggle && <Picker 
                    set='apple' 
                    color="#a29bfe"
                    onSelect={onEmojiClick} 
                    showPreview={false}
                    showSkinTones={false}
                />}
            </div>
        </div> 
    )
}

export default ChatForm