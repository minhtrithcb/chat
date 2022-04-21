import React, { useContext, useState } from 'react'
import styles from './GroupInfoTab.module.scss'
import avatar from '../../assets/images/user.png'
import { BsBellSlashFill,BsChatLeftDots} from "react-icons/bs";
import { MdReport, MdLogout} from "react-icons/md";
import clsx from 'clsx';
import useTheme  from '../../hooks/useTheme'
import { ChatContext } from '../../context/ChatContext';
import { Link } from 'react-router-dom';
import Alert from '../Common/Alert/Alert';

const GroupInfoTab = () => {
    const {friend, currentChat} = useContext(ChatContext)
    const {theme} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const classesDarkMode = clsx(styles.GroupInfoTab, { 
      [styles.dark]: theme === "dark",
    })
  
    const userComfirm = (isComfirm) => {
      console.log(friend); 
      setIsOpen(false)
    }

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