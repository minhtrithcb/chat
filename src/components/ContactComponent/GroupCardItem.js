import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Common/Avatar/Avatar'
import styles from './ContactComponent.module.scss'

const GroupCardItem = ({group, children}) => {
    return (
        <div className={styles.card}>
            <div className={styles.btnTopContainer}>
                {children.map(c => c.key === 'topLeft' ? c : <div key={c.key}></div> )}
                {children.map(c => c.key === 'topRight' && c )}
            </div>
            <div className={styles.avatar}>
                {group && <Avatar 
                    letter={group.name.charAt(0)}    
                /> }
            </div>
            <Link to="#/">{group.name}</Link>
            {group.des  ? 
                <small >{group.des}</small>:
                <small >Nhóm không có giới thiệu</small>
            }
            <div className={styles.btnContainer}>
                {children.map(c => c.key === 'botLeft' && c )}
                {children.map(c => c.key === 'botRight' && c )}
            </div>
        </div>
    )
}

export default GroupCardItem