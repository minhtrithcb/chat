import React from 'react'
import styles from './Contact.module.scss'
import girl from '../../assets/images/girl.png'
import boy from '../../assets/images/boy.png'
import clsx from 'clsx'
import useTheme  from '../../hooks/useTheme'

const Contact = () => {

    const {theme} = useTheme()

    const classesDarkMode = clsx(styles.contact,{ 
        [styles.dark]: theme === "dark"
    })
    const classesDarkMode2 = clsx(styles.messages,{ 
        [styles.dark]: theme === "dark"
    })

    return (
        <div className={classesDarkMode}>
            <div className={styles.heading}>
                <p>Messages (20)</p>
                <input type="text" placeholder='Search ...' />
            </div>

            <div className={classesDarkMode2}>
                <small>Pined</small>
                <div className={[styles.messagesItem,styles.active].join(" ")}>
                    <div className={styles.avatar}>
                        <img src={girl} alt="friend" />
                    </div>
                    <span>
                        <b>username</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <small>All messages</small>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
                <div className={styles.messagesItem}>
                    <div className={styles.avatar}>
                        <img src={boy} alt="friend" />
                    </div>
                    <span>
                        <b>Yasuo</b>
                        <p>Gank team nà</p>
                    </span>
                    <span>
                        <small>2:20 PM</small>
                        <p>2</p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Contact