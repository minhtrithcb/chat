import React, { useState } from 'react'
import avatar from '../../assets/images/user.png'
import { Link } from 'react-router-dom';
import styles from './ConversationOption.module.scss'
import Button from '../Common/Button/Button'

const FriendItem = ({friend, onClick, inAddFriend}) => {
    const [add, setAdd] = useState(inAddFriend || false)
    
    const handleClick = (friend) => {
        setAdd(prev => !prev)
        onClick(friend)
    }

    return (
        <div key={friend._id} className={styles.userItem}>
            <div className={styles.avatar}>
                <img src={avatar} alt="avatar" />
            </div> 
            <Link to={`/profile/${friend._id}`}>{friend.fullname}</Link>
            {!add ? 
                <Button onClick={() => handleClick(friend)}>Thêm</Button> : 
                <Button onClick={() => handleClick(friend)} danger>Bỏ chọn</Button>
            }
        </div>
    )
}

export default FriendItem