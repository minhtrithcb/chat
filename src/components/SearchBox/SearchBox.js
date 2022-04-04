import clsx from 'clsx'
import React, { useContext, useRef, useState} from 'react'
import useTheme from '../../hooks/useTheme'
import styles from './SearchBox.module.scss'
import avatar from '../../assets/images/user.png'
import { FiDelete } from "react-icons/fi";
import Button from '../Button/Button'
import useToggle from '../../hooks/useToggle'
import userApi from '../../api/userApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import friendReqApi from '../../api/friendReqApi'
import { SocketContext } from '../../context/SocketContext'
const SearchBox = () => {
    const {theme} = useTheme()
    const [input, setInput] = useState("")
    const [toggle, toggleF] = useToggle(false)
    const [results, setResults] = useState([])
    const [userFriend, setUserFriend] = useState([])
    const [friendReqs, setFriendReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const inputRef = useRef()
    const {socket} = useContext(SocketContext)

    const classesDarkMode = clsx(styles.heading,{ 
        [styles.dark]: theme === "dark"
    })

    // Change keyword searching ...
    const handleChage = (e) => {
        const value = e.target.value.trim()
        setInput(value)
        fetchResult(value)
    }

    // Submit searching ...
    const fetchResult = async (value) => {
        if (value.length >= 3 && value !== "" ) {
            try {
                const {data} = await userApi.search(value, currentUser.id)
                setResults(data[0]);
                setUserFriend(data[1].friend);
                setFriendReqs(data[2]);
            } catch (error) {
                console.log(error);
            }
            toggleF(true)            
        }
    } 

    // Delete Search box
    const handleDelete = () => {
        let newKeyWord = input.substring(0, input.length - 1)
        setInput(newKeyWord)
        fetchResult(newKeyWord)
        inputRef.current.focus();
    }

    // Close Search box
    const handleClose = () => {
        setInput("")
        toggleF(false)
    }

    // Sent Friend request
    const handleSendFriendRes = async (reciver) => {
        const user =  await userApi.getByUserId(currentUser.id)
        const {data} = await friendReqApi.createFriendReq(user.data, reciver)
        socket.emit("sendAddFriend", {reciverId: data.reciver._id , ...data})
        setFriendReqs(prev => [...prev, data])
    }

    // UnSend add Friend quest
    const handleUnsendFriendRes = async (value) => {
        await friendReqApi.unSendFriendReq(value._id)
        const remove = friendReqs.filter(fr => fr._id !== value._id)
        setFriendReqs(remove)
    }
    

    return (
        <div className={classesDarkMode}>
            <p>Tìm kiếm {toggle && <Button onClick={handleClose}>Đóng</Button> }</p>
            <div className={styles.inputChat}>
                <input type="text" placeholder='Tìm kiếm ...'
                    ref={inputRef}
                    value={input}
                    onChange={handleChage} 
                />
                {toggle &&  <FiDelete onClick={handleDelete} />}
            </div>
            {toggle && <div className={styles.chatBox}>
                <ul className={styles.filter}>
                    <li>
                        Tất cả
                        <small>20</small>
                    </li>
                    <li className={styles.active}>
                        Người dùng
                        <small>{results && results.length}</small>
                    </li>
                    <li>
                        Nhóm
                        <small>15</small>
                    </li>
                </ul>
                <ul className={styles.result}>
                    {results.length !== 0 ? results.map(res => (
                        <li className={styles.resultItem} key={res._id}>
                            <div className={styles.avatar}>
                                <img src={avatar} alt="friend" />
                                <span className={styles.isOnline}></span>
                            </div>
                            <div>
                                <b>{res.fullname}</b>
                                <p>online</p>
                            </div>
                            {
                                // If user has result in friendList
                                userFriend.includes(res._id) ? 
                                <Button disabled>
                                    Đã kết bạn
                                </Button>
                                : 
                                // or user has friend in friend request
                                friendReqs.find(s => s.reciver._id === res._id)?
                                <Button onClick={() => 
                                    handleUnsendFriendRes(friendReqs.find(s => s.reciver._id === res._id))
                                }>
                                    Đã chờ duyệt
                                </Button>
                                :
                                <Button primary onClick={() => handleSendFriendRes(res)}>
                                    Kết bạn
                                </Button>
                            }
                        </li>
                    )) : 
                    <small>Không tìm thấy kết quả nào</small>
                    }
                </ul>
            </div>}
        </div>
    )
}

export default SearchBox