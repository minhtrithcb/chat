import React, { useContext, useEffect, useState } from 'react'
import FriendList from '../../components/FriendList/FriendList'
import styles from './Contact.module.scss'
import avatar from '../../assets/images/user.png'
import Button from '../../components/Button/Button'
import friendReqApi from '../../api/friendReqApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FriendContext } from '../../context/FriendContext'

const Contact = () => {
  const [friendReqs, setfriendReqs] = useState([])
  const [acceptFriendReqs, setAcceptFriendReqs] = useState([])
  const [currentUser] = useDecodeJwt()
  const {setFriendList, setFrLength} = useContext(FriendContext)

  useEffect(() => {
    let isMounted = true;   
    const getFriendReqs = async () => {
      // Get all FR when current user send Fr
      const dataFr = friendReqApi.getFriendReq(currentUser.id)
       // Get all FR when current user have Someone sent a Fr
      const dataAcceptFr = friendReqApi.getAcceptFriendReq(currentUser.id)

      if (isMounted) {
        Promise.all([dataFr, dataAcceptFr]).then(([dataFr, dataAcceptFr]) => {
          // console.log(dataFr.data);
          setfriendReqs(dataFr.data)
          setFrLength(dataAcceptFr.data.length)
          setAcceptFriendReqs(dataAcceptFr.data)
        })
      }
    }

    getFriendReqs()
    return () => { isMounted = false };
  }, [currentUser.id, setFrLength])
  
  // Current user accept Fr
  const handleAcceptFriendReq = async (id, sender) => {
    const {data} = await friendReqApi.acceptFriendReq(id, sender, currentUser.id)
    if (data.success) {
      toast.success("Kết bạn thành công");
      const remove = acceptFriendReqs.filter(fr => fr._id !== id)
      setAcceptFriendReqs(remove)
      setFrLength(remove.length)
      setFriendList(prev => [...prev, sender])
    }
  }

  // UnSend Friend Reqs(flag true)  or denie Friend Reqs(flag false)
  const handleUnsendFriendRes = (id, flag = true) => {
    Swal.fire({
      title: 'Bạn có muốn xóa lời kết bạn không?',
      showDenyButton: true,
      confirmButtonText: 'Có',
      icon: 'warning',
      denyButtonText: `Không`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await friendReqApi.unSendFriendReq(id)
        if (flag) {
          const remove = friendReqs.filter(fr => fr._id !== id)
          setfriendReqs(remove)
        } else {
          const remove = acceptFriendReqs.filter(fr => fr._id !== id)
          setAcceptFriendReqs(remove)
          setFrLength(remove.length)
        }
        toast.success("Xóa kết bạn thành công");
      } 
    })
  }

  return (
    <div className={styles.contactContainer}>
      {/* left side  */}
      <FriendList />
      {/* Right side  */}
      <div className={styles.friendReqs}>
        <div className={styles.heading}>
          <h3>Danh sách kết bạn</h3>
        </div>
        <div className={styles.main}>
          {friendReqs.length > 0 && <h4>Danh sách chờ kết bạn</h4>}
          <div className={styles.cardContainer}>
            {friendReqs && friendReqs.map((fr => 
              <div className={styles.card} key={fr._id}>
                <div className={styles.avatar}>
                    <img src={avatar} alt="friend" />
                </div>
                <a href="/#">{fr.reciver.fullname}</a>
                <small title={fr.reciver.email}>
                  {
                    fr.reciver.email.length > 15 ?
                    `${fr.reciver.email.slice(0, 15)} ...` :
                    fr.reciver.email
                  }
                </small>
                <Button fluid 
                  onClick={() => handleUnsendFriendRes(fr._id)}>
                    Đang chờ
                </Button>
              </div>
              ))}
          </div>
          <h4>Danh sách người gửi tin kết bạn</h4>
          <div className={styles.cardContainer}>
          {acceptFriendReqs.length > 0 ? acceptFriendReqs.map(fr => (
            <div className={styles.card} key={fr._id}>
                <div className={styles.avatar}>
                    <img src={avatar} alt="friend" />
                </div>
                <a href="/#">{fr.sender.fullname}</a>
                <small>
                  {
                    fr.sender.email.length > 15 ?
                    `${fr.sender.email.slice(0, 15)} ...` :
                    fr.sender.email
                  }
                </small>
                <Button primary fluid
                onClick={() => handleAcceptFriendReq(fr._id, fr.sender)}
                >Chấp nhận</Button>
                <Button danger fluid
                onClick={() => handleUnsendFriendRes(fr._id, false)}>Từ chối</Button>
            </div>
          )):
          <p>Bạn chưa ai gửi lời kết bạn đến bạn.</p>
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact