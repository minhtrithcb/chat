import React, { useContext, useEffect} from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.scss'
import avatar from '../../assets/images/user.png'
import {  BsChatSquareDots, BsPeople, BsTelephone,BsGear , BsBookmarkPlus , BsStar} from "react-icons/bs";
import { AiOutlinePoweroff } from "react-icons/ai";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import Swal from 'sweetalert2';
import authApi from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { toast } from 'react-toastify';
import { FriendContext } from '../../context/FriendContext';
import { SocketContext } from '../../context/SocketContext';

const Navbar = () => {
  const {theme, toggle} = useTheme()
  const navigate = useNavigate()
  const {setAuth} = useContext(AuthContext)
  const {frLength, setFrLength} = useContext(FriendContext)
  const [currentUser] = useDecodeJwt()
  const {socket} = useContext(SocketContext)

  const classesDarkMode = clsx(styles.navBar,{ 
    [styles.dark]: theme === "dark"
  })

  useEffect(() => {        
    socket.on("getAddFriend", data => {
      if(data) setFrLength(prev => prev + 1);
    })
  }, [socket, setFrLength])

  // funtion Log out 
  const handleLogout = () => {
    Swal.fire({
      title: 'Bạn có muốn đăng xuất không?',
      icon: 'info',
      showDenyButton: true,
      confirmButtonText: 'Có',
      denyButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success(`Đăng xuất thành công`)
      }})
      .then(async () => {
        await authApi.logout(currentUser.id);
        setAuth({isLogin: false})
        navigate('/login', {replace: true})
      })
  }

  return (
    <div className={classesDarkMode}>
        {/* // Mobile  */}
        <div className={styles.mobileView}>
            <b>React Chat</b>
            <div className={styles.avatar}>
              <p>{currentUser?.username}</p>
              <img src={avatar} alt="currunt_user" />
            </div>
        </div>
        {/* // Desktop  */}
        <div className={styles.user}>
          <div className={styles.avatar}>
            <img src={avatar} alt="currunt_user" />
          </div>
          <span>
            <small className="activity">Online</small><br/>
            <Link to={`/profile/${currentUser?.id}`}>{currentUser?.username}</Link>
          </span>
        </div>
        <NavLink to={`/`}>
          <BsChatSquareDots />
          <p>Trang chủ</p>
        </NavLink>
        <NavLink to={`/contact`}>
          <BsPeople />
          <p>Danh bạ</p>
          {frLength > 0 ? <span>{frLength}</span> : null}
        </NavLink>
        <NavLink to={`/admin`}>
          <BsTelephone />
          <p>admin</p>
        </NavLink>

        <div className={styles.hr} />

        <NavLink to={`/`}>
          <BsStar />
          <p>Trang chủ</p>
        </NavLink>
        <NavLink to={`/contact`}>
          <BsBookmarkPlus />
          <p>Danh bạ</p>
        </NavLink>
        <NavLink to={`/admin`}>
          <BsGear />
          <p>admin</p>
        </NavLink>

        <div className={styles.hr} />
        <div className={styles.btn_logout} onClick={handleLogout}>
          <AiOutlinePoweroff />
          <span>Thoát</span>
        </div>
        <input type="checkbox" onClick={toggle} className={styles.checkBox} />
    </div>
  )
}

export default Navbar