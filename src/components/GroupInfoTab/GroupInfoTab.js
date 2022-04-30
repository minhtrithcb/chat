import React, { useContext, useState } from 'react'
import styles from './GroupInfoTab.module.scss'
import avatar from '../../assets/images/user.png'
import { BsBellSlashFill,BsChatLeftDots} from "react-icons/bs";
import { MdReport, MdLogout} from "react-icons/md";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import { ChatContext } from '../../context/ChatContext';
import { SocketContext } from '../../context/SocketContext';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../Common/Alert/Alert';
import converApi from '../../api/converApi';
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { toast } from 'react-toastify';
import chatApi from '../../api/chatApi';

const GroupInfoTab = () => {
    const {socket} = useContext(SocketContext)
    const {setCurrentChat ,currentChat, friend} = useContext(ChatContext)
    const {theme} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const [currentUser] = useDecodeJwt()
    const navigator = useNavigate()
    const classesDarkMode = clsx(styles.GroupInfoTab, { 
      [styles.dark]: theme === "dark",
    })
  
    const userComfirm = async (isComfirm) => {
      if (isComfirm) {
        try {
          // In case group master out group => delete group  
          if (currentChat.owner === currentUser.id) {
            setIsOpen(false)
            socket.emit("send-deleteGroup", { 
                recivers : friend, 
                roomId: currentChat._id,
                sender: currentUser.id,
            })
            const res = await converApi.deleteGroup(currentUser.id, currentChat._id)
            if (res.data?.success) {
              setCurrentChat(null)
              toast.success('Xóa nhóm thành công')
              navigator('/', {replace: true})
            } else toast.error('Xóa nhóm thất bại')          
          } else {
            setIsOpen(false)
            // If not group master out group and leave msg
            const {data} = await chatApi.postNewChat({
              roomId: currentChat._id,
              sender: currentUser.id,
              text:   `${currentUser.username} đã rời khỏi nhóm` ,
              type: "Notify"
            })
            // Send to socket room
            socket.emit("send-msg", data)
            // Send to socket id
            socket.emit("sendToFriendOnline", { 
                recivers : friend, 
                ...data
            })
            const res = await converApi.leaveGroup(currentUser.id, currentChat._id)
            if (res.data?.success) {
              setCurrentChat(null)
              toast.success('Thoát nhóm thành công')
              navigator('/', {replace: true})
            } else toast.error('Thoát nhóm thất bại')          
          }
        } catch (error) {
          console.log(error);
        } 
      } else setIsOpen(false)
    }

    // render group master
    const findGroupMaster = () => {
        return (currentChat.members.find(u => u._id === currentChat.owner))?.fullname
    }

    return (
        <>
          {currentChat && <div className={classesDarkMode}>
            <div className={styles.infoBackGround}>
              <div className={styles.avatar}>
                <img src={avatar} alt="friendAvatar" />
              </div>
            </div>
            <div className={styles.infoText}>
              <h4>{currentChat.name}</h4>
              <p><b>Chủ nhóm</b> : {findGroupMaster()}</p>
            </div>
            <div className={styles.infoText}>
                <p>Dolor sit amet consectetur adipisicing elit. Reiciendis, quod voluptatum? Expedita ex voluptate necessitatibus consequatu</p>
                <b>Thành viên</b>
            </div>
            <div className={styles.infoUserList}>
                {currentChat.members.map( user => (
                    <div className={styles.infoUserItem} key={user._id}>
                        <div className={styles.avatar}>
                            <img src={avatar} alt="friendAvatar" />
                        </div>
                        <Link to={`/profile/${user._id}`}>{user.fullname}</Link>
                        <span>
                            <BsChatLeftDots/>
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles.infoAction}>
              <span >
                <BsBellSlashFill /> 
                Chặn
              </span>
              <span >
                <MdReport /> 
                Báo cáo
              </span>
              <span onClick={() => setIsOpen(true)}>
                <MdLogout /> 
                Thoát nhóm
              </span>
            </div>
          </div>}
    
          <Alert 
            isOpen={isOpen} 
            heading={'Thoát nhóm'} 
            text={`Bạn có muốn thoát nhóm không ${currentChat.owner === currentUser.id ? '(Trong trường hợp bạn là chủ nhóm sẻ xóa nhóm !)' : " "}`} 
            userComfirm={userComfirm}
          />
        </>
      )
}

export default GroupInfoTab