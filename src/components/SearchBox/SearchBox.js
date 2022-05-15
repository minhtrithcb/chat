import clsx from 'clsx'
import React, { useCallback, useContext, useRef, useState} from 'react'
import useTheme from '../../hooks/useTheme'
import styles from './SearchBox.module.scss'
import Avatar from '../Common/Avatar/Avatar'
import Button from '../Common/Button/Button'
import useToggle from '../../hooks/useToggle'
import {FiDelete} from "react-icons/fi";
import userApi from '../../api/userApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import friendReqApi from '../../api/friendReqApi'
import chatApi from '../../api/chatApi'
import { SocketContext } from '../../context/SocketContext'
import { Link, useNavigate } from 'react-router-dom'
import groupReqApi from '../../api/groupReq'
import { toast } from 'react-toastify'
import { ChatContext } from '../../context/ChatContext'
import { BsFillCheckCircleFill } from "react-icons/bs";
import renderSubString from '../../helper/renderSubString'

const SearchBox = () => {
    const {theme} = useTheme()
    const {setCurrentChat, setChatsOption, setFriend} = useContext(ChatContext)
    const [toggle, toggleF] = useToggle(false)
    const [results, setResults] = useState([])
    const [oldResults, setOldResults] = useState([])
    const [userFriend, setUserFriend] = useState([])
    const [friendReqs, setFriendReqs] = useState([])
    const [userGroup, setUserGroup] = useState([])
    const [groupReqs, setGroupReqs] = useState([])
    const [tabActive, setTabActive] = useState("All")
    const [currentUser] = useDecodeJwt()
    const inputRef = useRef()
    const {socket} = useContext(SocketContext)
    const [value, setValue] = useState('')
    const classesDarkMode = clsx(styles.heading,{ 
        [styles.dark]: theme === "dark"
    })
    const navigate = useNavigate();


    // Submit searching ...
    const fetchResult = async (value) => {
        if (value.length >= 3 && value !== "" ) {
            try {
                const {data} = await userApi.search(value, currentUser.id)
                setResults([...data.users, ...data.groups]);
                setOldResults([...data.users, ...data.groups]);
                setUserFriend(data.userFriends);
                setFriendReqs(data.friendReqs);
                setUserGroup(data.userGroup)
                setGroupReqs(data.groupReq)
                setTabActive('All')
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

    const handleChange = (event) => {
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

    // Sent Group request
    const handleSendGroupRes = async (conversation) => {        
        // if send to private group
        if (conversation.private) {
            const sender =  await userApi.getByUserId(currentUser.id)
            const reciver =  await userApi.getByUserId(conversation.owner)
            const {data} = await groupReqApi.createGroupReq(sender.data, reciver.data, conversation)
            socket.emit("sendGroupRequest", {reciverId: data.reciver._id , ...data})
            setGroupReqs(prev => [...prev, data])
        // Accept if send to public group
        } else {
            const res = await groupReqApi.acceptGroupPublic(conversation._id , currentUser.id)
            if (res.data.success) {
                // Call socket
                const {data} = await chatApi.postNewChat({
                    roomId: conversation._id ,
                    sender: currentUser.id,
                    text:  `${currentUser.username} đã được thêm vào nhóm` ,
                    type: "Notify"
                })

                // Send to socket room
                socket.emit("send-msg", data)
                setFriend(conversation.members);
                toast.success("Đã vào nhóm thành công");
                setChatsOption({type: 'Group', title: "Tin nhắn nhóm"})
                setCurrentChat(conversation)
                navigate('/', {replace: true})
            }
        }
    }

    // UnSend add Friend request
    const handleUnsendFriendRes = async (value) => {
        await friendReqApi.unSendFriendReq(value._id)
        const remove = friendReqs.filter(fr => fr._id !== value._id)
        setFriendReqs(remove)
    }
    
    // UnSend add Group request
    const handleUnsendGroupRes = async (value) => {
        await groupReqApi.unSendGroupReq(value._id)
        const remove = groupReqs.filter(gr => gr._id !== value._id)
        setGroupReqs(remove)
    }
    
    // Fiter render result group or not
    const filterGroup = (flag = true) => {
        return oldResults.filter(item => flag ? item.type === 'Group':  item.type !== 'Group')
    }

    // Handle Chage Tab
    const handleChageTabs = (type) => {
        let newArr = oldResults.filter(res => {
            switch (type) {
                case 'All':
                    setTabActive('All')
                    return res
                case 'Group':
                    setTabActive('Group')
                    return res?.type === "Group" && res
                
                case 'User':
                    setTabActive('User')
                    return res?.fullname && res 
            
                default:
                    setTabActive('All')
                    return res;
            }
        })
        setResults(newArr)
    }

    return (
        <div className={classesDarkMode}>
            <div>
                <p>Tìm kiếm </p>
                {toggle && <Button onClick={handleClose}>Đóng</Button> }
            </div>
            <div className={styles.inputChat}>
                <input type="text" placeholder='Tìm kiếm theo tên hoặc email'
                    ref={inputRef}
                    value={value}
                    onChange={handleChange} 
                />
                <small>Hãy nhập ít nhất 3 ký tự</small>
                {toggle && <FiDelete onClick={handleDelete} /> }
            </div>
            {toggle && <div className={styles.chatBox}>
                <ul className={styles.filter}>
                    <li 
                        className={tabActive === "All" ? styles.active : " "} 
                        onClick={() => handleChageTabs('All')}>
                        Tất cả
                        <small>{oldResults && oldResults.length}</small>
                    </li>
                    <li 
                        className={tabActive === "User" ? styles.active : " "} 
                        onClick={() => handleChageTabs('User')}>
                        Người dùng
                        <small>{filterGroup(false).length}</small>
                    </li>
                    <li 
                        className={tabActive === "Group" ? styles.active : " "} 
                        onClick={() => handleChageTabs('Group')}>
                        Nhóm
                        <small>{filterGroup().length}</small>
                    </li>
                </ul>
                <ul className={styles.result}>
                    {results.length !== 0 ? results.map(res => (
                        <li className={styles.resultItem} key={res._id}>
                            <div className={styles.avatar}>
                                <Avatar
                                    size={'sm'}
                                    letter={res.fullname ? res.fullname.charAt(0) : res.name.charAt(0)}
                                />
                            </div>
                            <div>
                                {res.fullname ? <Link to={`/profile/${res._id}`}>{res.fullname} {res.isVerifi && <BsFillCheckCircleFill title='Đã xác thực' />}</Link>: 
                                <Link to={`/group/${res._id}`}>{res.name}</Link>}
                                {res.fullname && <small title={res.email}>{renderSubString(res.email, 17)}</small>}
                            </div>
                            {res.fullname ? 
                                // User 
                                (userFriend.includes(res._id)  ?
                                    <Button disabled>
                                        Đã kết bạn
                                    </Button>: 
                                     (friendReqs.find(s => s.reciver._id === res._id)?
                                     <Button onClick={() => 
                                         handleUnsendFriendRes(friendReqs.find(s => s.reciver._id === res._id))
                                     }>
                                        Đang chờ
                                    </Button> : 
                                    <Button primary onClick={() => handleSendFriendRes(res)}>
                                        Kết bạn
                                    </Button>
                                ))
                                :
                                // Group
                                (userGroup.find(ug => ug._id === res._id)  ?
                                <Button disabled>
                                    Đã Trong nhóm 
                                </Button>:                     
                                    (groupReqs.find(gr => gr.room._id === res._id ) ?
                                    <Button 
                                    onClick={() => 
                                        handleUnsendGroupRes(groupReqs.find(gr => gr.room._id === res._id))
                                    }>
                                        Đang chờ
                                    </Button> : 
                                    <Button primary onClick={() => handleSendGroupRes(res)}>
                                        Tham gia
                                    </Button>))
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