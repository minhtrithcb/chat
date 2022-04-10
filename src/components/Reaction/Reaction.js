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
  
export const ReactionRender = ({type, number}) => {
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
        <span className={styles.showReaction}>
            {/* {type ===  && <img src={like} alt={type} /> } */}
            {
                reaction.map(r => (
                    r.title === type && <img src={r.src} alt={r.title} key={r.title} />
                ))
            }
            <small>{number}</small>
        </span>
    )
}


const Reaction = ({float, handleClickReaction}) => {

    const classesDarkMode = clsx(styles.reacts,{ 
        [styles.floatRight]: float === "floatRight",
        [styles.floatLeft]: float === "floatLeft",
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
            <div className={styles.reaction} ref={reactionRef}>
                <span className={styles.reactBtn} onClick={() => setToggle(prev => !prev)}>
                    <BsEmojiSmile />
                </span>

                {toggle && <div className={classesDarkMode} ref={reactionRef}>
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