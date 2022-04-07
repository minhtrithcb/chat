import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../../assets/images/user.png'
import styles from './ContactComponent.module.scss'

const CardItem = ({friend, reciver, sender, children}) => {
    return (
        <div className={styles.card}>
            <div className={styles.btnTopContainer}>
                {children.map(c => c.key === 'topLeft' ? c : <div key={c.key}></div> )}
                {children.map(c => c.key === 'topRight' && c )}
            </div>
            <div className={styles.avatar}>
                <img src={avatar} alt="friend" />
            </div>
            {friend && <Link to={`/profile/${friend._id}`}>{friend.fullname}</Link>}
            {sender && <Link to={`/profile/${sender._id}`}>{sender.fullname}</Link>}
            {reciver && <Link to={`/profile/${reciver._id}`}>{reciver.fullname}</Link>}
            <small >
                {friend && friend.email}
                {reciver && reciver.email}
                {sender && sender.email}
            </small>
            <div className={styles.btnContainer}>
                {children.map(c => c.key === 'botLeft' && c )}
                {children.map(c => c.key === 'botRight' && c )}
            </div>
        </div>
    )
}

export default CardItem