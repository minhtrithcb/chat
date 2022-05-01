import React, { useContext, useEffect, useState} from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.scss'
import {  BsChatSquareDots, BsPeople, BsTelephone,BsGear , BsBookmarkPlus , BsStar} from "react-icons/bs";
import { AiOutlinePoweroff } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import authApi from '../../api/authApi';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { toast } from 'react-toastify';
import { FriendContext } from '../../context/FriendContext';
import { SocketContext } from '../../context/SocketContext';
import { ChatContext } from '../../context/ChatContext';
import Alert from '../Common/Alert/Alert';
import { AuthContext } from '../../context/AuthContext';
import Avatar from '../Common/Avatar/Avatar';

const Navbar = () => {
  const {theme, toggle} = useTheme()
  const {frLength, setFrLength } = useContext(FriendContext)
  const {countUnRead, setCountUnRead, setCurrentChat} = useContext(ChatContext)
  const {setAuth} = useContext(AuthContext)
  const [currentUser] = useDecodeJwt()
  const {socket} = useContext(SocketContext)
  const {pathname} = useLocation();
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const listLink2 = [
    {
      icon: <BsStar />,
      text: 'Bài viết',
      path: "/posts"
    },
    {
      icon: <BsBookmarkPlus />,
      text: 'Dấu trang',
      path: "/bookmark"
    },
    {
      icon: <BsGear />,
      text: 'Cài đặt',
      path: "/setting"
    },
  ]

  const classesDarkMode = clsx(styles.navBar,{ 
    [styles.dark]: theme === "dark"
  })

  // Notifi Add frined
  useEffect(() => {        
    socket.on("getAddFriend", data => {
      if(data) setFrLength(prev => prev + 1);
    })

    socket.on("getSomeOneMessage", data => {
      if (data.sender !== currentUser.id) {
        setCountUnRead(prev => prev + 1)
      }
    })
    return () => {
      setIsOpen(false)
    }
  }, [socket, setFrLength, currentUser.id, setCountUnRead])

  // funtion Log out 
  const handleLogout = async (userComfirm) => {
    if (userComfirm) {
        toast.success(`Đăng xuất thành công`)
        await authApi.logout();
        setAuth({isLogin: false})
        setCurrentChat(null)
        navigate(`/login`,  {replace: true})
    }
    setIsOpen(false)
  }

  const checkActiveClass = (path) => {
    return pathname === path ? styles.active : " "
  }

  return (
    <div className={classesDarkMode}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {currentUser && <Avatar 
                letter={currentUser.username.charAt(0)} 
            /> }
          </div>
          <span>
            <small className="activity">Online</small>
            <Link to={`/profile/${currentUser?.id}`}>{currentUser?.username}</Link>
          </span>
        </div>

        <NavLink to={`/`} className={checkActiveClass('/')}>
          <BsChatSquareDots />
          <p>Trang chủ</p>
          {countUnRead > 0 && <span>{countUnRead}</span> }
        </NavLink>
        <NavLink to={`/contact`} className={checkActiveClass('/contact')}>
          <BsPeople />
          <p>Danh bạ</p>
          {frLength > 0 &&  <span>{frLength}</span> }
        </NavLink>
        <NavLink to={`/admin`} className={checkActiveClass('/admin')}>
          <BsTelephone />
          <p>Admin</p>
        </NavLink>

        <div className={styles.hr} />

        {listLink2 && listLink2.map((item, index) =>(
          <NavLink to={`${item.path}`} key={index}>
            {item.icon}
            <p>{item.text}</p>
          </NavLink>))}
        <div className={styles.hr} />
        {/* // User tab only mobile  */}
        <NavLink to={`/profile/${currentUser?.id}`} 
            className={
              pathname.includes('profile') ? 
              `${styles.userMobile} ${styles.active}`: styles.userMobile
            }>
            <FiUser />
            <p></p>
        </NavLink>
        <div className={styles.btn_logout} onClick={() => setIsOpen(true)}>
          <AiOutlinePoweroff />
          <span>Thoát</span>
        </div>
        <input type="checkbox" onClick={toggle} className={styles.checkBox} defaultChecked={theme === "dark"} />
        
        <Alert 
          isOpen={isOpen} 
          heading="Đăng xuất" 
          text="Bạn có muốn đăng xuất không ?" 
          userComfirm={handleLogout} 
          textComfirm="Đăng xuất"
        />
    </div>
  )
}

export default Navbar