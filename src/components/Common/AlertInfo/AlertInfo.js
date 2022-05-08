import clsx from 'clsx'
import React from 'react'
import useTheme from '../../../hooks/useTheme'
import styles from './AlertInfo.module.scss'

const AlertInfo = ({text}) => {
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.alertContent, { 
        [styles.dark]: theme === "dark"
    })

  return (
    <div className={classesDarkMode}>{text}</div>
  )
}

export default AlertInfo