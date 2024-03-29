import React, { useContext, useState } from 'react'
import styles from './FriendInfoTab.module.scss'
import { BsFillEnvelopeFill,BsFillTelephoneFill,BsFillPersonFill,BsBriefcaseFill
      } from "react-icons/bs";
import { AiOutlineUserDelete} from "react-icons/ai";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import { ChatContext } from '../../context/ChatContext';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../Common/Alert/Alert';
import Avatar from '../Common/Avatar/Avatar';
import { toast } from 'react-toastify';
import converApi from '../../api/converApi';
import userApi from '../../api/userApi';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { SocketContext } from '../../context/SocketContext';

const FriendInfoTab = () => {
  const {friend, setCurrentChat, currentChat} = useContext(ChatContext)
  const {socket} = useContext(SocketContext)
  const [currentUser] = useDecodeJwt()
  const [isOpen, setIsOpen] = useState(false)
  const navigator = useNavigate()
  const {theme} = useTheme()
  const classesDarkMode = clsx(styles.friendProfile, { 
    [styles.dark]: theme === "dark"
  })

  const userComfirm = async (isComfirm) => {
    if (isComfirm) {
      try {
        setIsOpen(false)
        socket.emit("send-deleteGroup", { 
          recivers : friend, 
          roomId: currentChat._id,
          sender: currentUser.id,
        })
        await converApi.deleteByFriendId(currentUser.id, friend[0]._id)
        await userApi.unFriend(currentUser.id, friend[0]._id);
        setCurrentChat(null)
        toast.success("Xóa kết bạn thành công");
        navigator('/', {replace: true})
      } catch (error) {
        console.log(error);
      }
    } else setIsOpen(false)
  }

  return (
    <>
      {friend && <div className={classesDarkMode}>
        <div className={styles.infoBackGround}>
          <div className={styles.avatar}>
            <Avatar 
                letter={friend[0].fullname.charAt(0)} 
            /> 
          </div>
        </div>
        <div className={styles.infoText}>
          <h4>
            <Link to={`/profile/${friend[0]._id}`}>{friend[0].fullname}</Link>
          </h4>
          <small>{friend[0].email}</small>
        </div>
        <div className={styles.infoText}>
          {/* <p>ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, quod voluptatum? Expedita ex voluptate necessitatibus consequatu</p> */}
        </div>
        <div className={styles.frinedInfo}>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsBriefcaseFill /> 
              Đang làm :
            </span>
            <small>Googller</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillPersonFill /> 
              Giới tính:
            </span>
            <small>Nữ</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillTelephoneFill /> 
              Điện thoại:
            </span>
            <small>0123577998</small>
          </div>
          <div className={styles.frinedInfoItem}>
            <span>
              <BsFillEnvelopeFill /> 
              Email:
            </span>
            <small>{friend[0].email}</small>
          </div>
        </div>
        <div className={styles.infoAction}>
          <span onClick={() => setIsOpen(true)}>
            <AiOutlineUserDelete /> 
            Xóa kết bạn
          </span>
        </div>
      </div>}

      <Alert 
        isOpen={isOpen} 
        heading={'Xóa bạn'} 
        text={'Bạn có muốn xóa kết bạn với người này không'} 
        userComfirm={userComfirm}
      />
    </>
  )
}

export default FriendInfoTab