import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.scss'
import avatar from '../../assets/images/user.png'
import {  BsChatSquareDots, BsPeople, BsTelephone,BsGear , BsBookmarkPlus , BsStar} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import Swal from 'sweetalert2';
import authApi from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';

const Navbar = () => {
  const {theme, toggle} = useTheme()
  const navigate = useNavigate()
  const {setAuth} = useContext(AuthContext)
  const [currentUser] = useDecodeJwt()

  const linkRoutePrim = [
    {
      path: "/",
      icon: <BsChatSquareDots />,
      title: "Home"
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

  const handleLogout = () => {
    Swal.fire({
      title: 'Do you want to log out?',
      icon: 'info',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Success",
          showConfirmButton:false,
          timer: 1000,
        })
        .then(async () => {
          await authApi.logout(currentUser.id);
          setAuth({isLogin: false})
          navigate('/login', {replace: true})
        })
      } 
    })
  }

  return (
    <div className={classesDarkMode}>
        <div className={styles.avatar}>
          <img src={avatar} alt="currunt_user" />
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
        <div className={styles.btn_plus} onClick={handleLogout}>
          <BiLogOut />
        </div>
        <input type="checkbox" onClick={toggle} className={styles.checkBox} />
    </div>
  )
}

export default Navbar