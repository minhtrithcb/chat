import clsx from 'clsx'
import React from 'react'
import noChat from '../../assets/images/undraw_things_to_say_re_jpcg.svg'
import useTheme from '../../hooks/useTheme'
import styles from './NotHaveChat.module.scss'

const NotHaveChat = () => {
  const {theme} = useTheme()

  const classesDarkMode = clsx(styles.notHaveChat,{ 
    [styles.dark]: theme === "dark"
  })

  return (
    <div className={classesDarkMode}>
        <img src={noChat} alt="noChat" />
        <h2>Bạn chưa mở cuộc hội thoại nào hết</h2>
    </div>
  )
}

export default NotHaveChat