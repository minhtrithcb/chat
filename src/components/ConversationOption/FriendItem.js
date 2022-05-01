import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from './ConversationOption.module.scss'
import Button from '../Common/Button/Button'
import Avatar from '../Common/Avatar/Avatar'

const FriendItem = ({friend, onClick, inAddFriend}) => {
    const [add, setAdd] = useState(inAddFriend || false)
    
    const handleClick = (friend) => {
        setAdd(prev => !prev)
        onClick(friend)
    }

    return (
        <div key={friend._id} className={styles.userItem}>
            <div className={styles.avatar}>
                <Avatar size={'sm'} letter={friend.fullname.charAt(0)} />
            </div> 
            <span>
                <Link to={`/profile/${friend._id}`}>{friend.fullname}</Link>    
                <small>{friend.email}</small>
            </span>
            {!add ? 
                <Button onClick={() => handleClick(friend)}  type="Button">Thêm</Button> : 
                <Button onClick={() => handleClick(friend)} danger type="Button">Bỏ chọn</Button>
            }
        </div>
    )
}

export default FriendItem