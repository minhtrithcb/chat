import clsx from 'clsx'
import React, { useContext, useState } from 'react'
import useTheme from '../../hooks/useTheme'
import styles from './MobileNav.module.scss'
import Dropdown, {DropdownItem} from '../Common/Dropdown/Dropdown'
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoExitOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { toast } from 'react-toastify'
import authApi from '../../api/authApi'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import Alert from '../Common/Alert/Alert'

const MobileNav = () => {
    const {theme, toggle} = useTheme()
    const [currentUser] = useDecodeJwt()
    const classesDarkMode = clsx(styles.mobileNav,{ 
        [styles.dark]: theme === "dark"
    })
    const {setCurrentChat} = useContext(ChatContext)
    const {setAuth} = useContext(AuthContext)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    
    // funtion Log out 
    const handleLogout = async (userComfirm) => {
        if (userComfirm) {
            toast.success(`Đăng xuất thành công`)
            await authApi.logout();
            setAuth({isLogin: false})
            setCurrentChat(null)
            navigate(`/login`,  {replace: true})
        }
        setIsOpen(false)
    }


    return (
        <div className={classesDarkMode}>
            <h3>Tin nhắn</h3>
            <Dropdown >
                <Link to={`/profile/${currentUser.id}`} ><DropdownItem icon={AiOutlineUser}>
                    Tài khoản
                </DropdownItem></Link>
                <DropdownItem icon={MdOutlineDarkMode} onClick={toggle}>Đổi giao diện</DropdownItem>
                <DropdownItem icon={IoExitOutline} onClick={() => setIsOpen(true)}>Đăng xuất</DropdownItem>
            </Dropdown>

            <Alert 
                isOpen={isOpen} 
                heading="Đăng xuất" 
                text="Bạn có muốn đăng xuất không ?" 
                userComfirm={handleLogout} 
                textComfirm="Đăng xuất"
            />
        </div>
    )
}

export default MobileNav