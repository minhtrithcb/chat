import React, { useContext } from 'react'
import styles from './FriendProfile.module.scss'
import avatar from '../../assets/images/boy.png'
import { BsTelephoneOutbound, BsChatSquareDots, BsThreeDots ,BsHeart
        ,BsFillEnvelopeFill,BsFillTelephoneFill,BsFillPersonFill,BsBriefcaseFill
      } from "react-icons/bs";
import { ThemeContext } from '../../context/ThemeContext'
import clsx from 'clsx';

const FriendProfile = () => {

  const {theme} = useContext(ThemeContext)

  const classesDarkMode = clsx(styles.friendProfile, { 
    [styles.dark]: theme === "dark"
  })

  return (
    <div className={classesDarkMode}>
      <div className={styles.avatar}>
        <img src={avatar} alt="friendAvatar" />
      </div>
      <h4>Cheems</h4>
      <div className={styles.friendBtnConatiner}>
          <span>
            <BsTelephoneOutbound />
          </span>
          <span>
            <BsChatSquareDots />
          </span>
          <span>
            <BsHeart />
          </span>
          <span>
            <BsThreeDots />
          </span>
      </div>
      <div className={styles.frinedInfo}>
        <div className={styles.frinedInfoItem}>
          <span>
            <BsBriefcaseFill /> 
            Company :
          </span>
          <small>Googller</small>
        </div>
        <div className={styles.frinedInfoItem}>
          <span>
            <BsFillPersonFill /> 
            Role :
          </span>
          <small>CEO</small>
        </div>
        <div className={styles.frinedInfoItem}>
          <span>
            <BsFillTelephoneFill /> 
            Phone :
          </span>
          <small>0123577998</small>
        </div>
        <div className={styles.frinedInfoItem}>
          <span>
            <BsFillEnvelopeFill /> 
            Email :
          </span>
          <small>ACASNCS@gmail.com</small>
        </div>
      </div>
    </div>
  )
}

export default FriendProfile