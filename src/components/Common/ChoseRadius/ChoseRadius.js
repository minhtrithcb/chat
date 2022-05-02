import clsx from 'clsx'
import React from 'react'
import useTheme from '../../../hooks/useTheme'
import styles from './ChoseRadius.module.scss'

const ChoseRadius = ({text, title, active, ...rest}) => {
    const {theme} = useTheme()
    const classesDarkMode = clsx(styles.ChoseRadius,{ 
        [styles.dark]: theme === "dark",
        [styles.active]: active,
    })
    return (
        <div className={classesDarkMode} {...rest}>
           <div>
                <p>{title}</p>
                <span className={active ? clsx(styles.dotActive, styles.dot) : styles.dot }></span>
           </div>
            <small>{text}</small>
        </div>
    )
}

export default ChoseRadius