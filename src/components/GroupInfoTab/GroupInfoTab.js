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
            toast.success('Thoát nhòm thành công')
            navigator('/', {replace: true})
          } else toast.error('Thoát nhòm thất bại')          
        } catch (error) {
          console.log(error);
        }
      }
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
              <p>Chủ nhóm : {findGroupMaster()}</p>
            </div>
            <div className={styles.infoText}>
                <p>Thông tin: dolor sit amet consectetur adipisicing elit. Reiciendis, quod voluptatum? Expedita ex voluptate necessitatibus consequatu</p>
                <p>Thành viên</p>
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
            text={'Bạn có muốn thoát nhóm không'} 
            userComfirm={userComfirm}
          />
        </>
      )
}

export default GroupInfoTab