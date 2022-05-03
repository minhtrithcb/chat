import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Common/Avatar/Avatar'
import styles from './ContactComponent.module.scss'

const GroupReqCardItem = ({group, sender, children}) => {
    return (
        <div className={styles.card}>
            <div className={styles.btnTopContainer}>
                {children.map(c => c.key === 'topLeft' ? c : <div key={c.key}></div> )}
                {children.map(c => c.key === 'topRight' && c )}
            </div>
            <div className={styles.groupReq}>
                {/* <b>{group.name}</b> */}
                <div className={styles.groupReqAvatar}>
                    <Avatar 
                        size={'sm'}
                        letter={sender.fullname.charAt(0)}    
                    /> 
                    <Link to={`/profile/${sender._id}`}>{sender.fullname}</Link>
                </div>

                <p>Muốn xin vào nhóm <b>{group.name}</b></p>
            </div>
            <div className={styles.btnContainer}>
                {children.map(c => c.key === 'botLeft' && c )}
                {children.map(c => c.key === 'botRight' && c )}
            </div>
        </div>
    )
}

export default GroupReqCardItem