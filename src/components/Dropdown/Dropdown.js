import clsx from 'clsx'
import React, { useRef, useState } from 'react'
import styles from './Dropdown.module.scss'
import useOutside from '../../hooks/useOutside'
import { BsThreeDotsVertical } from "react-icons/bs";
import useTheme from '../../hooks/useTheme';

export const DropdownItem = ({children, icon: Icon, ...rest}) => {
  return (
    <li className={styles.DropdownItem} {...rest}>
        {Icon && <Icon />} {children}
    </li>
  )
}

const Dropdown = ({children, icon: Icon, position}) => {
    const {theme} = useTheme()
    const [isOpen, setisOpen] = useState(false)

    const dropDownRef = useRef(null)
    useOutside(dropDownRef, () => {
        setisOpen(false)
    })

    const classes = clsx(styles.DropdownBtn,{ 
        [styles.right]: position === "right",
        [styles.dark]: theme === "dark",
    })

    return (
        <div className={styles.Dropdown}>
            <div className={classes} onClick={() => setisOpen(!isOpen)}>
                {Icon ? <Icon /> : <BsThreeDotsVertical />}
            </div>

            {isOpen && <ul className={styles.DropdownUl} ref={dropDownRef}>
                {children}
            </ul>}
        </div>
    )
}

export default Dropdown