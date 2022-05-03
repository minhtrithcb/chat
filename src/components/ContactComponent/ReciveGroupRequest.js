import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Common/Button/Button'
import styles from './ContactComponent.module.scss'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import converApi from '../../api/converApi'
import { toast } from 'react-toastify'
import { GroupContext } from '../../context/GroupContext'
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown'
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx'
import { SocketContext } from '../../context/SocketContext'
import groupReqApi from '../../api/groupReq'
import GroupReqCardItem from './GroupReqCardItme'
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";

const ReciveGroupRequest = () => {
    const {theme} = useTheme()
    const [acceptGroupReqs, setAcceptGroupReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const {setGrLength} = useContext(GroupContext)
    const {socket} = useContext(SocketContext)
    // const [friendReqId, setfriendReqId] = useState('')
    // const [isOpen, setIsOpen] = useState(false)

    const classesDarkMode = clsx(styles.cardContainer,{ 
      [styles.dark]: theme === "dark"
    })

    // Notifi group request
    useEffect(() => {        
      let isMounted = true;   
      socket.on("getGroupRequest", data => {
        if(isMounted && data) {
          setAcceptGroupReqs(prev => [...prev, data])
        }
      })
      return () => { isMounted = false };
    }, [socket])

    // Fetch Data first 
    useEffect(() => {
        let isMounted = true;   
        const getAcceptGroupReq = async () => {
            const {data} = await groupReqApi.getAcceptGroupReq(currentUser.id)
            if (isMounted) setAcceptGroupReqs(data)
        }
        getAcceptGroupReq()
        return () => { isMounted = false };
    }, [currentUser.id])


    // Accept Friend Reqs
    // const handleAcceptFriendReq = async (id, sender) => {
    //   const {data} = await friendReqApi.acceptFriendReq(id, sender, currentUser.id)
    //   if (data.success) {
    //     toast.success("Kết bạn thành công");
    //     const remove = acceptFriendReqs.filter(fr => fr._id !== id)
    //     setAcceptFriendReqs(remove)
    //     setFrLength(remove.length)
    //     await converApi.createFriendConver(sender._id, currentUser.id)
    //   }
    // }

    // // Un accept Friend Reqs
    // const handleUnsendFriendRes = async userComfirm => {
    //   if (userComfirm) {
    //     await friendReqApi.unSendFriendReq(friendReqId)
    //     const remove = acceptFriendReqs.filter(fr => fr._id !== friendReqId)
    //     setAcceptFriendReqs(remove)
    //     setFrLength(remove.length)
    //     setfriendReqId('')
    //     toast.success("Xóa kết bạn thành công");
    //   }
    //   setIsOpen(false)
    // }

    
  return (
      <div className={classesDarkMode}>
          {acceptGroupReqs.length > 0 ? acceptGroupReqs.map(gr => (
            <GroupReqCardItem group={gr.room} sender={gr.sender} key={gr._id} >
                <div key={'topLeft'}>
                    {gr.private ? 
                    <AiOutlineLock style={{color: '#ff7675'}} />  :                  
                    <AiOutlineUnlock style={{color: '#2ecc71'}} />}
                </div>
                <Dropdown position="right" key="topRight">
                    <DropdownItem >
                            Từ chối gia nhập
                    </DropdownItem>
                    <Link to={`/profile/${gr.sender._id}`}>
                        <DropdownItem>
                            Hồ sơ
                        </DropdownItem>     
                    </Link>               
                </Dropdown>
                <Button 
                    fluid key="botLeft" primary
                    // onClick={() => handleAcceptFriendReq(fr._id, fr.sender)}
                >
                    Chấp nhận
                </Button>
                <Button 
                    fluid danger key="botRight" 
                    onClick={() => {
                    //   setfriendReqId(fr._id)
                    //   setIsOpen(true) 
                  }}
                >
                    Từ chối
                </Button>
            </GroupReqCardItem>
          )):
          <p>Chưa ai gửi lời kết bạn đến bạn.</p>
          }
          {/* <Alert 
              isOpen={isOpen} 
              heading="Xóa lời mời" 
              text="Bạn có muốn xóa lời mời kết bạn không ?" 
              userComfirm={handleUnsendFriendRes}
          /> */}
        </div>
  )
}

export default ReciveGroupRequest