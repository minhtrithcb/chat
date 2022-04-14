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
import useOutside from '../../hooks/useOutside';
import Button from '../Button/Button'

import { Picker } from 'emoji-mart'

const ChatForm = () => {
    const {currentChat, friend, chatEdit, setChatEdit, chatReply, setChatReply} = useContext(ChatContext)
    const [inputChat, setInputChat] = useState('')
    const [textReply, setTextReply] = useState('')
    const [isEditChat, setIsEditChat] = useState(false)
    const [isReplyChat, setIsReplyChat] = useState(false)
    const [flag, setFlag] = useState(true)
    const [currentUser] = useDecodeJwt()
    const [toggle, setToggle] = useState(false)
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)
    const editFormRef = useRef(null)

    const classesDarkMode = clsx(styles.chatForm,{ 
        [styles.dark]: theme === "dark",
        [styles.isEditChat]: isEditChat === true,
        [styles.isReplyChat]: isReplyChat === true,
    })

    const classes2DarkMode = clsx(styles.replyChat, { 
        [styles.dark]: theme === "dark",
    })

    // When User chose edit chat
    useEffect(() => {
        if (chatEdit !== null) {
            // Set input field = edit text
            setInputChat(chatEdit.text)
            // enble edit text area
            setIsEditChat(true)
            // Focus that area
            editFormRef.current.focus()
        }
        return () => {
            setInputChat('')
            setIsEditChat(false)
        }
    }, [chatEdit])

    // When User chose reply chat
    useEffect(() => {
        if (chatReply !== null) {
            // enble reply text area
            setIsReplyChat(true)

            // set text reply
            setTextReply(chatReply.text)

            // Focus that area
            editFormRef.current.focus()
        }
        return () => {
            setInputChat('')
            setIsReplyChat(false)
        }
    }, [chatReply])
    
    // User OnChange Display loading
    const handleOnChangeInput = (e) => {
        setInputChat(e.target.value)
        // send to order user if flag true or have value
        if (flag && e.target.value !== "" && e.target.value.length >= 3) {
            socket.emit("send-PendingChat", { 
                roomId: currentChat._id,
                reciverId: friend._id , 
            })

            setFlag(false)
        // Send stop even if the input have less than 3
        } else if (e.target.value === "" && e.target.value.length <= 3) {
            socket.emit("stop-pendingChat", {
                roomId: currentChat._id, 
                reciverId: friend._id , 
            })
            setFlag(true)
        }
    }

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
                // Sent event to stop pending when on submit
                socket.emit("stop-pendingChat", {roomId: currentChat._id})
                setFlag(true)
                setInputChat("")

                // If user not edit or not reply => post new chat
                if (!isEditChat && !isReplyChat) {
                    const {data} = await chatApi.postNewChat({
                        roomId: currentChat._id,
                        sender: currentUser.id,
                        text:   inputChat,
                    })
                    // Send to socket room
                    socket.emit("send-msg", data)
                    // Send to socket id
                    socket.emit("sendToFriendOnline", { friendId: friend._id , ...data})

                // If user reply chat
                } else if (isReplyChat) {
                    // console.log("reply");
                    const {data} = await chatApi.postReplyChat({
                        roomId: currentChat._id,
                        sender: currentUser.id,
                        text:   inputChat,
                        replyMsg: chatReply
                    })
                    // Send to socket room
                    socket.emit("send-msg", data)
                    // Send to socket id
                    socket.emit("sendToFriendOnline", { friendId: friend._id , ...data})
                    // reset
                    setIsReplyChat(false)
                    setChatReply(null)

                // else user edit patch that chat
                } else {
                    // console.log("edit");

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
                    // reset
                    setIsEditChat(false)
                    setChatEdit(null)
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
        setIsEditChat(false)
        setChatEdit(null)
    }

    // Stop reply
    const handleStopReply = e => {
        setIsReplyChat(false)
        setChatReply(null)
    }

    return (
        <div className={classesDarkMode} >
            {/* Edit & post new chat  */}
            {!isReplyChat && <>
            <textarea 
                placeholder={!isEditChat ? `Hãy nhập gì đó ...` : `Sửa lại chat ...`}
                value={inputChat} 
                onKeyDown={handleCtrlEnter}
                onChange={handleOnChangeInput}
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
            </div></>}

            {/* reply chat  */}
            {isReplyChat && chatReply && <>
           <div className={classes2DarkMode}>
                <div>
                    <b>{chatReply.sender !== currentUser.id ?
                        friend.fullname : "Bạn"
                    }</b>
                    <Button size={'md'} danger onClick={handleStopReply}>Bỏ trả lời</Button>
                    <p>{textReply}</p>
                </div>
           </div>
            <textarea 
                className={styles.replyTextArea}
                placeholder={`Trả lời ...`}
                value={inputChat} 
                onKeyDown={handleCtrlEnter}
                onChange={handleOnChangeInput}
                ref={editFormRef}
            ></textarea>
            {/* <small>Bấm Ctrl + Enter để gửi</small> */}
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
            </>
            }
        </div> 
    )
}

export default ChatForm