import React, { useEffect, useState } from 'react'
import FriendList from '../../components/FriendList/FriendList'
import styles from './Contact.module.scss'
import avatar from '../../assets/images/user.png'
import Button from '../../components/Button/Button'
import friendReqApi from '../../api/friendReqApi'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import Swal from 'sweetalert2'

const Contact = () => {

  const [friendReqs, setfriendReqs] = useState([])
  const [acceptFriendReqs, setAcceptFriendReqs] = useState([])
  const [currentUser] = useDecodeJwt()

  useEffect(() => {
    let isMounted = true;   
    const getFriendReqs = async () => {
      const {data} = await friendReqApi.getFriendReq(currentUser.id)
      if (isMounted) setfriendReqs(data)
    }

    getFriendReqs()
    return () => { isMounted = false };
  }, [currentUser.id])

  useEffect(() => {
    let isMounted = true;   
    const getAcceptFriendReqs = async () => {
      const {data} = await friendReqApi.getAcceptFriendReq(currentUser.id)
      if (isMounted) setAcceptFriendReqs(data)
    }

    getAcceptFriendReqs()
    return () => { isMounted = false };
  }, [currentUser.id])
  
  const handleAcceptFriendReq = async (id) => {
    const {data} = await friendReqApi.acceptFriendReq(id, currentUser.id)
    if (data?.success) {
      const remove = acceptFriendReqs.filter(fr => fr._id !== id)
      setAcceptFriendReqs(remove)
    }
  }

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
        }
      } 
    })
  }

  return (
    <div className={styles.contactContainer}>
      <FriendList />
      <div className={styles.friendReqs}>
        <div className={styles.heading}>
          <h3>Danh sách kết bạn</h3>
        </div>

        <div className={styles.main}>
          <h4>Danh sách chờ kết bạn</h4>
          <div className={styles.cardContainer}>
            {friendReqs.length > 0 ? friendReqs.map((fr => 
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
              )): 
              <p>Bạn chưa có lời danh sách chờ nào.</p>
              }
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
                onClick={() => handleAcceptFriendReq(fr._id)}
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