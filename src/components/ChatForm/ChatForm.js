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
import Picker from 'emoji-picker-react';
import useOutside from '../../hooks/useOutside';
import Button from '../Button/Button'

const ChatForm = () => {
    const {currentChat, friend, chatEdit, setChatEdit} = useContext(ChatContext)
    const [inputChat, setInputChat] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [currentUser] = useDecodeJwt()
    const [toggle, setToggle] = useState(false)
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)
    const editFormRef = useRef(null)

    const classesDarkMode = clsx(styles.chatForm,{ 
        [styles.dark]: theme === "dark",
        [styles.isEdit]: isEdit
    })

    // When User chose edit chat
    useEffect(() => {
        if (chatEdit !== null) {
            // Set input field = edit text
            setInputChat(chatEdit.text)
            // enble edit text area
            setIsEdit(true)
            // Focus that area
            editFormRef.current.focus()
        }
        return () => {
            setInputChat('')
            setIsEdit(false)
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
    const onEmojiClick = (event, emojiObject) => {
        setInputChat(input => `${input} ${emojiObject.emoji}`)
    };

    // Submit send message
    const handleSubmit = async () => {
        if (inputChat !== "") {
            try {
                // If user not edit post new chat
                if (!isEdit) {
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
                        chatId: chatEdit._id,
                        sender: currentUser.id,
                        text:   inputChat,
                    })

                    setIsEdit(false)
                    setChatEdit(null)
                    setInputChat("")

                    // Send to socket room
                    socket.emit("send-edit", data)
                    // Send to socket id
                    socket.emit("sendToFriendOnline", { friendId: friend._id , ...data})
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
        setIsEdit(false)
        setChatEdit(null)
    }

    return (
        <div className={classesDarkMode} >
            {!isEdit ? 
            <>
                <textarea 
                    placeholder='Hãy nhập gì đó ...'
                    value={inputChat} 
                    onKeyDown={handleCtrlEnter}
                    onChange={(e) => setInputChat(e.target.value)}
                    ref={editFormRef}
                ></textarea> 
                <small>Bấm Ctrl + Enter để gửi</small>
            </>
            : 
            <>
                <textarea 
                    placeholder='Sửa gì đó ...'
                    value={inputChat} 
                    onKeyDown={handleCtrlEnter}
                    onChange={(e) => setInputChat(e.target.value)}
                    ref={editFormRef}
                ></textarea>
                <small>Bạn đang chỉnh sửa (Bấm Ctrl + Enter để gửi)</small>
                <Button danger onClick={handleStopEdit}>Bỏ chỉnh sửa</Button>
            </>
            }
            <div className={styles.emote} onClick={() => setToggle(prev => !prev)}>
                <BsEmojiSmile/>
            </div>
            <div className={styles.sendBtn} onClick={handleSubmit}>
                <TiLocationArrow/>
            </div>
            {toggle && 
                <div ref={emojiDiv}>
                    <Picker 
                    disableSearchBar={true}
                    onEmojiClick={onEmojiClick} 
                    pickerStyle={{marginLeft: 'auto'}} 
                    groupVisibility={{
                        recently_used: false,
                        animals_nature: false,
                        food_drink: false,
                        travel_places: false,
                        activities: false,
                        objects: false,
                        symbols: false,
                        flags: false
                    }}
                    />
                </div>
            }
        </div> 
    )
}

export default ChatForm