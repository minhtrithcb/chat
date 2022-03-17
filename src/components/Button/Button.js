import clsx from 'clsx';
import React from 'react'
import styles from './Button.module.scss'


const Button = ({primary, children}) => {
    
    const classStyle = clsx(styles.btn , {
        [styles.primary] : primary
    })
    
    return (
        <div className={classStyle}>
            {children}
        </div>
    )
}

export default Button