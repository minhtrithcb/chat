import React, { useRef } from 'react'
import useOutside from '../../../hooks/useOutside'
import styles from './Model.module.scss'
import { CSSTransition } from 'react-transition-group'
import { VscChromeClose } from "react-icons/vsc";

const Model = ({isOpen, heading, handleClick, children, prevLostData}) => {
    // Click outside to close
    const modelDiv = useRef(null)
    useOutside(modelDiv, () => {
        if (prevLostData) {prevLostData()} 
        else {
            handleClick(false)
        }
    })

    return (
        <CSSTransition 
            in={isOpen} 
            timeout={200} 
            classNames={{
                enter: styles.enter,
                enterActive: styles.enterActive,
                exit: styles.exit,
                exitActive: styles.exitActive,
            }}
            unmountOnExit
            nodeRef={modelDiv}
        >   
            <>
                <div className={styles.backdrop}></div>
                <div className={styles.modelBox} ref={modelDiv}>
                    <div className={styles.modelHeading}>
                        {heading && <p>{heading}</p>}
                        <button className={styles.closeBtn} 
                        onClick={() => handleClick(false)}><VscChromeClose /></button>
                    </div>
                    <div className={styles.modelContainer}>
                        {children}
                    </div>
                </div>
            </>
        </CSSTransition>
    )
}

export default Model