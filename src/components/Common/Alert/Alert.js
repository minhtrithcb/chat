import React, { useRef } from 'react'
import styles from './Alert.module.scss'
import { CSSTransition } from 'react-transition-group'
import Button from '../Button/Button'

const Alert = ({isOpen, heading, userComfirm, text}) => {
    const modelDiv = useRef(null)

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
                      <p>{heading}</p>
                    </div>
                    <div className={styles.modelContainer}>
                        <p>{text}</p>
                    </div>

                    <div className={styles.footer}>
                        <Button size={'lg'} onClick={() => userComfirm(true) }>Thoát</Button>
                        <Button primary size={'lg'} onClick={() => userComfirm(false) }>Ở lại</Button>
                    </div>
                </div>
            </>
        </CSSTransition>
    )
}

export default Alert