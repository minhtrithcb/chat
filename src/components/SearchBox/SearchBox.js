import clsx from 'clsx'
import React, { useCallback, useContext, useRef, useState} from 'react'
import useTheme from '../../hooks/useTheme'
import styles from './SearchBox.module.scss'
import avatar from '../../assets/images/user.png'
import Button from '../Common/Button/Button'
import useToggle from '../../hooks/useToggle'
import {FiDelete} from "react-icons/fi";
import userApi from '../../api/userApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import friendReqApi from '../../api/friendReqApi'
import { SocketContext } from '../../context/SocketContext'
import { Link } from 'react-router-dom'

const SearchBox = () => {
    const {theme} = useTheme()
    const [toggle, toggleF] = useToggle(false)
    const [results, setResults] = useState([])
    const [userFriend, setUserFriend] = useState([])
    const [friendReqs, setFriendReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const inputRef = useRef()
    const {socket} = useContext(SocketContext)
    const [value, setValue] = useState('')
    const classesDarkMode = clsx(styles.heading,{ 
        [styles.dark]: theme === "dark"
    })

    // Submit searching ...
    const fetchResult = async (value) => {
        if (value.length >= 3 && value !== "" ) {
            try {
                const {data} = await userApi.search(value, currentUser.id)
                // console.log(data);
                setResults(data[0]);
                setUserFriend(data[1].friend);
                setFriendReqs(data[2]);
            } catch (error) {
                console.log(error);
            }
            toggleF(true)            
        }
    } 

    // debounce
    const debounce = (cb, delay = 1000) => {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(...args)
            },delay)
        }
    }

    const debounceFn = useCallback(debounce(fetchResult), []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleChange(event) {
        setValue(event.target.value);
        debounceFn(event.target.value);
    }

    // Close Search box
    const handleClose = () => {
        toggleF(false)
        setValue("")
    }

    // Close value in Search box
    const handleDelete = () => {
        let newKw = value.substring(0, value.length - 1);
        setValue(newKw)
        if (newKw.length < 3) {
            handleClose()
        } else {
            debounceFn(newKw);
        }
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
            <div>
                <p>Tìm kiếm </p>
                {toggle && <Button onClick={handleClose}>Đóng</Button> }
            </div>
            <div className={styles.inputChat}>
                <input type="text" placeholder='Tìm kiếm ...'
                    ref={inputRef}
                    value={value}
                    onChange={handleChange} 
                />
                {toggle && <FiDelete onClick={handleDelete} /> }
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
                                <Link to={`/profile/${res._id}`}>{res.fullname}</Link>
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
                                    Đang chờ
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