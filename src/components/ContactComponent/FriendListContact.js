import React, { useContext, useEffect } from 'react'
import CardItem from './CardItem'
import styles from './ContactComponent.module.scss'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { FriendContext } from '../../context/FriendContext'
import userApi from '../../api/userApi'
import Swal from 'sweetalert2'
import converApi from '../../api/converApi'
import { toast } from 'react-toastify'
import Button from '../Common/Button/Button'
import { AiOutlineUser } from "react-icons/ai";
import { BsChatSquareDots } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom'
import { BsBell, BsBellSlash } from "react-icons/bs";
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown'
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx'
import { ChatContext } from '../../context/ChatContext';

const FriendListContact = () => {
    const [currentUser] = useDecodeJwt()
    const {friendList, setFriendList} = useContext(FriendContext)
    const {setFriend, setCurrentChat, setChatsOption} = useContext(ChatContext)

    const {theme} = useTheme()
    const navigate = useNavigate();
    const classesDarkMode = clsx(styles.cardContainer,{ 
      [styles.dark]: theme === "dark"
    })

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
          await converApi.deleteByFriendId(currentUser.id, id)
          await userApi.unFriend(currentUser.id, id);
          const remove = friendList.filter(fr => fr._id !== id)
          setFriendList(remove)
          toast.success("Xóa kết bạn thành công");
        }
      })
    }

    // Redirect to chat friend
    const handleRedirectChat = async (friend) => {
      setFriend([friend])
      setChatsOption({type: 'Friend', title: "Tin nhắn bạn bè"})
      const {data} = await converApi.getOneByUserId(currentUser.id, friend._id)
      setCurrentChat(data)
      navigate('/', {replace: true})
    }

    return (
      <div className={classesDarkMode}>
          {friendList.length > 0 ? friendList.map(fr => (
            <CardItem friend={fr} key={fr._id} >
                <div className={!fr.notified ? `${styles.cardBellBtn} ${styles.unnotified}`: styles.cardBellBtn } key="topLeft">
                    {fr.notified ? <BsBell /> : <BsBellSlash />}
                </div>
                <Dropdown position="right" key="topRight">
                    <DropdownItem onClick={() => handleUnFriend(fr._id) }>Xóa kết bạn</DropdownItem>
                    <DropdownItem>Chọt</DropdownItem>
                    <DropdownItem>Tắt thông báo</DropdownItem>
                </Dropdown>
                <Button fluid primary key="botLeft">
                    <Link to={`/profile/${fr._id}`}>Hồ sơ</Link> 
                    <AiOutlineUser />
                </Button>
                <Button fluid key="botRight" onClick={() => handleRedirectChat(fr)}>
                    <span>Nhắn tin</span>  <BsChatSquareDots />
                </Button>
            </CardItem>
          ))
          :<p>Hãy kết bạn nhiều hơn nào !</p> }
      </div>
    )
}

export default FriendListContact