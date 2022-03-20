import clsx from 'clsx';
import React from 'react'
import styles from './Button.module.scss'


const Button = ({primary, dark, fluid, children, size, ...rest}) => {
    
    const sizeDefaut = size ? size : "md"

    const classStyle = clsx(styles.btn ,styles[sizeDefaut] ,{
        [styles.primary] : primary,
        [styles.btnDark] : dark, 
        [styles.fluid]: fluid,
    })

    return (
        <button className={classStyle} {...rest}>
            {children}
        </button>
    )
}

export default Button