import React, { useRef, useState } from 'react'
import styles from './Reaction.module.scss'
import haha from '../../assets/images/emoji/haha.png'
import anger from '../../assets/images/emoji/anger.png'
import cry from '../../assets/images/emoji/cry.png'
import hug from '../../assets/images/emoji/hug.png'
import like from '../../assets/images/emoji/like.png'
import love from '../../assets/images/emoji/love.png'
import wow from '../../assets/images/emoji/wow.png'
import clsx from 'clsx'
import useOutside from '../../hooks/useOutside'
import { BsEmojiSmile} from "react-icons/bs";
import useTheme from '../../hooks/useTheme'
  
export const ReactionRender = ({type, number, users}) => {
    const reaction = [
        {   
            title: 'like',
            src: like
        }, 
        {
            title: 'love',
            src: love
        }, 
        {
            title: 'hug',
            src: hug
        }, 
        {
            title: 'haha',
            src: haha
        }, 
        {
            title: 'wow',
            src: wow
        }, 
        {
            title: 'cry',
            src: cry
        }, 
        {
            title: 'anger',
            src: anger
        }, 
    ]
    return (
            <>
                {number > 0 && <span className={styles.showReaction}>
                    {reaction.map(r => (
                        r.title === type && <img src={r.src} alt={r.title} key={r.title} />
                    ))}
                    {<small>{number}</small>}
                    {users.length > 0 && 
                    <ul className={styles.ulReaction} >
                        {users.map((u,i) => (
                            <li key={i}>{u.username}</li>
                        ))}
                    </ul>}
                </span> }
            </>
    )
}


const Reaction = ({float, handleClickReaction}) => {
    const {theme} = useTheme()

    const classes = clsx(styles.reacts,{ 
        [styles.floatRight]: float === "floatRight",
        [styles.floatLeft]: float === "floatLeft",
    })

    const classesDarkMode = clsx(styles.reaction,{ 
        [styles.dark]: theme === "dark"
    })

    const [toggle, setToggle] = useState(false)

    const reactionRef = useRef(null)
    useOutside(reactionRef, () => {
        setToggle(false)
    })

    const reaction = [
        {   
            title: 'like',
            src: like
        }, 
        {
            title: 'love',
            src: love
        }, 
        {
            title: 'hug',
            src: hug
        }, 
        {
            title: 'haha',
            src: haha
        }, 
        {
            title: 'wow',
            src: wow
        }, 
        {
            title: 'cry',
            src: cry
        }, 
        {
            title: 'anger',
            src: anger
        }, 
    ]

    return (
            <div className={classesDarkMode} ref={reactionRef}>
                <span className={styles.reactBtn} onClick={() => setToggle(prev => !prev)}>
                    <BsEmojiSmile />
                </span>

                {toggle && <div className={classes} ref={reactionRef}>
                    {reaction.map((e,i) => (
                        <span key={i} onClick={() => handleClickReaction(e.title)}>
                            <img src={e.src} alt={e.title}  />
                        </span>
                    ))}
                </div> }
            </div> 
        )
}

export default Reaction