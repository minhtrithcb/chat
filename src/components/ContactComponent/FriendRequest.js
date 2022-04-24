import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import friendReqApi from '../../api/friendReqApi';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import Button from '../Common/Button/Button'
import styles from './ContactComponent.module.scss'
import { toast } from 'react-toastify';
import CardItem from './CardItem';
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown';
import clsx from 'clsx';
import useTheme from '../../hooks/useTheme';
import Alert from '../Common/Alert/Alert';

const FriendRequest = () => {
    const {theme} = useTheme()
    const [friendReqId, setfriendReqId] = useState('')
    const [friendReqs, setfriendReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.cardContainer,{ 
        [styles.dark]: theme === "dark"
    })
    const [isOpen, setIsOpen] = useState(false)
    // Fetch Data first 
    useEffect(() => {
        let isMounted = true;   
        const getFriendReqs = async () => {
            const {data} = await friendReqApi.getFriendReq(currentUser.id)
            if (isMounted) setfriendReqs(data)
        }
        getFriendReqs()
        return () => { isMounted = false };
    }, [currentUser.id])
    
    // UnSend Friend Reqs(flag true)  or denie Friend Reqs(flag false)
    const handleUnsendFriendRes = async userComfirm => {
        if (userComfirm) {
            await friendReqApi.unSendFriendReq(friendReqId)
            const remove = friendReqs.filter(fr => fr._id !== friendReqId)
            setfriendReqs(remove)
            setfriendReqId('')
            toast.success("Xóa kết bạn thành công");
        }
        setIsOpen(false)
    }

    return (
        <div className={classesDarkMode}>
        {friendReqs.length > 0 ? friendReqs.map((fr => 
            <CardItem reciver={fr.reciver} key={fr._id} >
                <Dropdown position="right" key="topRight">
                    <DropdownItem 
                        onClick={() => {
                            setfriendReqId(fr._id)
                            setIsOpen(true) 
                        }}>
                            Xóa lời kết bạn
                    </DropdownItem>
                    <Link to={`/profile/${fr.reciver._id}`}>
                        <DropdownItem>
                            Hồ sơ
                        </DropdownItem>     
                    </Link>               
                    </Dropdown>
                <Button 
                    fluid key="botLeft" 
                    onClick={() => {
                        setfriendReqId(fr._id)
                        setIsOpen(true) 
                    }}
                >
                    Đang chờ
                </Button>
               
            </CardItem>
            )): <p>Bạn chưa gửi lời mời cho ai cả !</p> }

            <Alert 
                isOpen={isOpen} 
                heading="Xóa lời mời" 
                text="Bạn có muốn xóa lời mời kết bạn không ?" 
                userComfirm={handleUnsendFriendRes}
            />
        </div>
    )
}

export default FriendRequest