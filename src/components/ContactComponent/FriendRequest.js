import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import friendReqApi from '../../api/friendReqApi';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import Button from '../Common/Button/Button'
import styles from './ContactComponent.module.scss'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CardItem from './CardItem';
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown';
import clsx from 'clsx';
import useTheme from '../../hooks/useTheme';

const FriendRequest = () => {
    const {theme} = useTheme()
    const [friendReqs, setfriendReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.cardContainer,{ 
        [styles.dark]: theme === "dark"
    })
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
            const remove = friendReqs.filter(fr => fr._id !== id)
            setfriendReqs(remove)
            toast.success("Xóa kết bạn thành công");
        } 
        })
    }

    return (
        <div className={classesDarkMode}>
        {friendReqs.length > 0 ? friendReqs.map((fr => 
            <CardItem reciver={fr.reciver} key={fr._id} >
                <Dropdown position="right" key="topRight">
                    <DropdownItem 
                        onClick={() => handleUnsendFriendRes(fr._id)}>
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
                    onClick={() => handleUnsendFriendRes(fr._id)}
                >
                    Đang chờ
                </Button>
            </CardItem>
            )): <p>Bạn chưa gửi lời mời cho ai cả !</p> }
        </div>
    )
}

export default FriendRequest