import React, { useContext } from 'react'
import styles from './FriendProfile.module.scss'
import avatar from '../../assets/images/boy.png'
import { BsTelephoneOutbound, BsChatSquareDots, BsThreeDots ,BsHeart
        ,BsFillEnvelopeFill,BsFillTelephoneFill,BsFillPersonFill,BsBriefcaseFill
      } from "react-icons/bs";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import { ChatContext } from '../../context/ChatContext';

const FriendProfile = () => {
  const {friend} = useContext(ChatContext)

  const {theme} = useTheme()

  const classesDarkMode = clsx(styles.friendProfile, { 
    [styles.dark]: theme === "dark"
  })

  return (
    <>
      {friend && <div className={classesDarkMode}>
        <div className={styles.avatar}>
          <img src={avatar} alt="friendAvatar" />
        </div>
        <h4>{friend.fullname}</h4>
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
              Company:
            </span>
            <small>Googller</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillPersonFill /> 
              Role:
            </span>
            <small>CEO</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillTelephoneFill /> 
              Phone:
            </span>
            <small>0123577998</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillEnvelopeFill /> 
              Email:
            </span>
            <small>{friend.email}</small>
          </div>
        </div>
      </div>}
    </>
  )
}

export default FriendProfile