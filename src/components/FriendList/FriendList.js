import React, {useContext, useEffect} from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import userApi from '../../api/userApi'
import avatar from '../../assets/images/user.png'
import { FriendContext } from '../../context/FriendContext'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import Button from '../Button/Button'
import FriendSearch from '../FriendSearch/FriendSearch'
import styles from './FriendList.module.scss'

const FriendList = () => {
    const [currentUser] = useDecodeJwt()
    const {friendList, setFriendList} = useContext(FriendContext)

    // Fetch all friend by user id
    useEffect(() => {
      let isMounted = true;

      const getAcceptFriendReqs = async () => {
        const {data} = await userApi.getFriendUser(currentUser.id)
        if (isMounted) setFriendList(data)
      }

      getAcceptFriendReqs()
      return () => { isMounted = false };
    }, [currentUser.id, setFriendList])

    // UnFriend By current user
    const handleUnFriend = async (id) => {
      Swal.fire({
        title: 'Bạn có muốn xóa lời bạn không?',
        showDenyButton: true,
        confirmButtonText: 'Có',
        icon: 'warning',
        denyButtonText: `Không`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await userApi.unFriend(currentUser.id, id)
          const remove = friendList.filter(fr => fr._id !== id)
          setFriendList(remove)
          toast.success("Xóa kết bạn thành công");
        }
      })
    }

    return (
      <div className={styles.FriendListContainer}>
        <h3>Danh sách bạn bè</h3>
        <FriendSearch data={friendList} setData={setFriendList}  />
        {friendList.length > 0 ? 
        friendList.map(f => (<div className={styles.FriendItem} key={f._id}>
          <div className={styles.avatar}>
              <img src={avatar} alt="friend" />
          </div>
         <div>
            <a href={`/#`}>{f.fullname}</a>
            <small>online</small>
         </div>
          <Button danger onClick={() => handleUnFriend(f._id)}>Xóa bạn</Button>
        </div>
        )) :
        <p>Danh sách bạn bè trống</p>
        }
        
      </div>
    )
}

export default FriendList