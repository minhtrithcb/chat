import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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

const Navbar = () => {
  const {theme, toggle} = useTheme()
  const navigate = useNavigate()
  const {setAuth} = useContext(AuthContext)
  const [currentUser] = useDecodeJwt()

  const linkRoutePrim = [
    {
      path: "/",
      icon: <BsChatSquareDots />,
      title: "Trang chủ"
    },
    {
      path: "/login",
      icon: <BsPeople />,
      title: "Login"
    },
    {
      path: "/admin",
      icon: <BsTelephone />,
      title: "Admin"
    }
  ]

  const linkRouteSec = [
    {
      path: "/s",
      icon: <BsStar />,
      title: "Home"
    },
    {
      path: "/logins",
      icon: <BsBookmarkPlus />,
      title: "Login"
    },
    {
      path: "/admins",
      icon: <BsGear />,
      title: "Admin"
    }
  ]

  const classesDarkMode = clsx(styles.navBar,{ 
    [styles.dark]: theme === "dark"
  })

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
            <b>{currentUser?.username}</b>
          </span>
        </div>
        {linkRoutePrim.map((route, i) => (
          <NavLink to={route.path} key={i}>
            {route.icon}
            <p>{route.title}</p>
            {/* <span>19</span> */}
          </NavLink>
        ))}
        <div className={styles.hr} />
        {linkRouteSec.map((route, i) => (
          <NavLink to={route.path} key={i}>
            {route.icon}
            <p>{route.title}</p>
            {/* <span>19</span> */}
          </NavLink>
        ))}
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