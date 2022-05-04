import React, { useEffect, useState } from 'react'
import useDecodeJwt from '../../hooks/useDecodeJwt';
import Button from '../Common/Button/Button'
import styles from './ContactComponent.module.scss'
import { toast } from 'react-toastify';
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown';
import clsx from 'clsx';
import useTheme from '../../hooks/useTheme';
import Alert from '../Common/Alert/Alert';
import groupReqApi from '../../api/groupReq';
import GroupCardItem from './GroupCardItem';
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";

const  GroupRequest = () => {
    const {theme} = useTheme()
    const [groupReqId, setGroupReqId] = useState('')
    const [groupReqs, setGroupReqs] = useState([])
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.cardContainer,{ 
        [styles.dark]: theme === "dark"
    })
    const [isOpen, setIsOpen] = useState(false)
    // Fetch Data first 
    useEffect(() => {
        let isMounted = true;   
        const getFriendReqs = async () => {
            const gr = await groupReqApi.getGroupReq(currentUser.id)
            if (isMounted) {
                setGroupReqs(gr.data)
            }
        }
        getFriendReqs()
        return () => { isMounted = false };
    }, [currentUser.id])
    
    // UnSend Friend Reqs(flag true)  or denie Friend Reqs(flag false)
    const handleUnsendFriendRes = async userComfirm => {
        if (userComfirm) {
            await groupReqApi.unSendGroupReq(groupReqId)
            const remove = groupReqs.filter(gr => gr._id !== groupReqId)
            setGroupReqs(remove)
            setGroupReqId('')
            toast.success("Xóa kết bạn thành công");
        }
        setIsOpen(false)
    }

    return (
        <div className={classesDarkMode}>
        {groupReqs.length > 0 ? groupReqs.map((gr => 
            <GroupCardItem group={gr.room} key={gr._id} >
                <div key={'topLeft'}>
                    {gr.private ? 
                    <AiOutlineLock style={{color: '#ff7675'}} />  :                  
                    <AiOutlineUnlock style={{color: '#2ecc71'}} />}
                </div>
                <Dropdown position="right" key="topRight" >
                    <DropdownItem
                        onClick={() => {
                            setGroupReqId(gr._id)
                            setIsOpen(true) 
                        }}
                    >
                        Xóa xin vào nhóm
                    </DropdownItem>
                </Dropdown>
                <Button fluid key="botRight" 
                    onClick={() => {
                        setGroupReqId(gr._id)
                        setIsOpen(true) 
                    }}
                >
                    Đang chờ
                </Button>
            </GroupCardItem>
            )): <p>Danh sách chờ trống !</p> }

            <Alert 
                isOpen={isOpen} 
                heading="Xóa lời mời" 
                text="Bạn có muốn xóa xin vào nhóm không ?" 
                userComfirm={handleUnsendFriendRes}
            />
        </div>
    )
}

export default GroupRequest