import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import styles from './ContactComponent.module.scss'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import friendReqApi from '../../api/friendReqApi'
import converApi from '../../api/converApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FriendContext } from '../../context/FriendContext'
import CardItem from './CardItem'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown'
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx'
import { SocketContext } from '../../context/SocketContext'

const ReciveFriendRequest = () => {
    const {theme} = useTheme()
    const [acceptFriendReqs, setAcceptFriendReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const {setFrLength} = useContext(FriendContext)
    const {socket} = useContext(SocketContext)
    const classesDarkMode = clsx(styles.cardContainer,{ 
      [styles.dark]: theme === "dark"
    })

    // Notifi Add frined
    useEffect(() => {        
      let isMounted = true;   

      socket.on("getAddFriend", data => {
        if(isMounted && data) {
          setAcceptFriendReqs(prev => [...prev, data])
        }
      })

      return () => { isMounted = false };

    }, [socket, setFrLength])

    // Fetch Data first 
    useEffect(() => {
        let isMounted = true;   
        const getAcceptFriendReqs = async () => {
            const {data} = await friendReqApi.getAcceptFriendReq(currentUser.id)
            if (isMounted) setAcceptFriendReqs(data)
        }
        getAcceptFriendReqs()
        return () => { isMounted = false };
    }, [currentUser.id])


    // Accept Friend Reqs
    const handleAcceptFriendReq = async (id, sender) => {
      const {data} = await friendReqApi.acceptFriendReq(id, sender, currentUser.id)
      if (data.success) {
        toast.success("Kết bạn thành công");
        const remove = acceptFriendReqs.filter(fr => fr._id !== id)
        setAcceptFriendReqs(remove)
        setFrLength(remove.length)
        await converApi.createFriendConver(sender._id, currentUser.id)
      }
    }

    // Un accept Friend Reqs
    const handleUnsendFriendRes = (id) => {
      Swal.fire({
        title: 'Bạn có muốn xóa lời kết bạn không?',
        showDenyButton: true,
        confirmButtonText: 'Có',
        icon: 'warning',
        denyButtonText: `Không`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await friendReqApi.unSendFriendReq(id)
          const remove = acceptFriendReqs.filter(fr => fr._id !== id)
          setAcceptFriendReqs(remove)
          setFrLength(remove.length)
          toast.success("Xóa kết bạn thành công");
        } 
      })
    }

  return (
      <div className={classesDarkMode}>
          {acceptFriendReqs.length > 0 ? acceptFriendReqs.map(fr => (
            <CardItem sender={fr.sender} key={fr._id} >
                <Dropdown position="right" key="topRight">
                    <DropdownItem 
                        onClick={() => handleUnsendFriendRes(fr._id)}>
                            Từ chối lời kết bạn
                    </DropdownItem>
                    <Link to={`/profile/${fr.reciver._id}`}>
                        <DropdownItem>
                            Hồ sơ
                        </DropdownItem>     
                    </Link>               
                    </Dropdown>
                <Button 
                    fluid key="botLeft" primary
                    onClick={() => handleAcceptFriendReq(fr._id, fr.sender)}
                >
                    Chấp nhận
                </Button>
                <Button 
                    fluid danger key="botRight" 
                    onClick={() => handleUnsendFriendRes(fr._id)}
                >
                    Từ chối
                </Button>
            </CardItem>
          )):
          <p>Bạn chưa ai gửi lời kết bạn đến bạn.</p>
          }
        </div>
  )
}

export default ReciveFriendRequest