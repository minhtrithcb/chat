import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.scss'
import avatar from '../../assets/images/user.png'
import {BsPlusLg,  BsChatSquareDots, BsPeople, BsTelephone,BsGear , BsBookmarkPlus , BsStar} from "react-icons/bs";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'

const Navbar = () => {
  const {theme, toggle} = useTheme()

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
        <div className={styles.btn_plus}>
          <BsPlusLg />
        </div>
        <input type="checkbox" onClick={toggle} className={styles.checkBox} />
    </div>
  )
}

export default Navbar