import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Common/Button/Button'
import styles from './ContactComponent.module.scss'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { toast } from 'react-toastify'
import { GroupContext } from '../../context/GroupContext'
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown'
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx'
import { SocketContext } from '../../context/SocketContext'
import groupReqApi from '../../api/groupReq'
import GroupReqCardItem from './GroupReqCardItme'
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import Alert from '../Common/Alert/Alert'
import chatApi from '../../api/chatApi'

const ReciveGroupRequest = () => {
    const {theme} = useTheme()
    const [acceptGroupReqs, setAcceptGroupReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const {setGrLength} = useContext(GroupContext)
    const {socket} = useContext(SocketContext)
    const [reqId, setReqId] = useState('')
    const [isOpen, setIsOpen] = useState(false)

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


    // Accept Group Reqs
    const handleAcceptGroupReq = async (reqId, roomId, sender) => {
      const {data} = await groupReqApi.acceptGroupReq(reqId, roomId, sender._id)
      if (data.success) {
        // Call socket
        const {data} = await chatApi.postNewChat({
            roomId,
            sender: sender._id,
            text:  `${sender.fullname} đã được thêm vào nhóm` ,
            type: "Notify"
        })

        // Send to socket room
        socket.emit("send-msg", data)
        // Send to socket id
        socket.emit("send-createGroup", {  
            recivers: [sender], 
            sender: currentUser.id, 
            group : data
        })
        toast.success("Đã chấp nhận");
        const remove = acceptGroupReqs.filter(gr => gr._id !== reqId)
        setAcceptGroupReqs(remove)
        setGrLength(remove.length)
      }
    }

    // Denie Group Reqs
    const handleDenieGroupRes = async userComfirm => {
      if (userComfirm) {
        await groupReqApi.unSendGroupReq(reqId)
        const remove = acceptGroupReqs.filter(gr => gr._id !== reqId)
        setAcceptGroupReqs(remove)
        setGrLength(remove.length)
        setReqId('')
        toast.success("Từ chối thành công");
      }
      setIsOpen(false)
    }

    
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
                    <Link to={`/profile/${gr.sender._id}`}>
                        <DropdownItem>
                            Hồ sơ
                        </DropdownItem>     
                    </Link>               
                </Dropdown>
                <Button 
                    fluid key="botLeft" primary
                    onClick={() => handleAcceptGroupReq(gr._id, gr.room._id, gr.sender)}
                >
                    Chấp nhận
                </Button>
                <Button 
                    fluid danger key="botRight" 
                    onClick={() => {
                      setReqId(gr._id)
                      setIsOpen(true) 
                  }}
                >
                    Từ chối
                </Button>
            </GroupReqCardItem>
          )):
          <p>Chưa ai gửi lời kết bạn đến bạn.</p>
          }
          <Alert 
              isOpen={isOpen} 
              heading="Xóa lời mời" 
              text="Bạn có muốn xóa lời mời kết bạn không ?" 
              userComfirm={handleDenieGroupRes}
          />
        </div>
  )
}

export default ReciveGroupRequest