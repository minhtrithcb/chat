import clsx from 'clsx'
import React from 'react'
import removeAccents from '../../../helper/removeAccents'
import styles from './Avatar.module.scss'


const Avatar = ({letter, size, isOnline}) => {

    const classes = clsx(styles.avatar,{ 
        [styles.md]: size === 'md',
        [styles.sm]: size === 'sm',
        [styles.lg]: size === 'lg',
    })

    const colorAndLetter = [
        {
            "letter": "a",
            "color": "#55efc4"
        },
        {
            "letter": "b",
            "color": "#74b9ff"
        },
        {
            "letter": "c",
            "color": "#a29bfe"
        },
        {
            "letter": "d",
            "color": "#b2bec3"
        },
        {
            "letter": "e",
            "color": "#2d3436"
        },
        {
            "letter": "f",
            "color": "#fd79a8"
        },
        {
            "letter": "g",
            "color": "#e84393"
        },
        {
            "letter": "h",
            "color": "#ff7675"
        },
        {
            "letter": "i",
            "color": "#d63031"
        },
        {
            "letter": "j",
            "color": "#fab1a0"
        },
        {
            "letter": "k",
            "color": "#e17055"
        },
        {
            "letter": "l",
            "color": "#fab1a0"
        },
        {
            "letter": "m",
            "color": "#00b894"
        },
        {
            "letter": "n",
            "color": "#fdcb6e"
        },
        {
            "letter": "o",
            "color": "#badc58"
        },
        {
            "letter": "p",
            "color": "#ff7979"
        },
        {
            "letter": "q",
            "color": "#ffbe76"
        },
        {
            "letter": "r",
            "color": "#f0932b"
        },
        {
            "letter": "s",
            "color": "#686de0"
        },
        {
            "letter": "t",
            "color": "#4834d4"
        },
        {
            "letter": "u",
            "color": "#22a6b3"
        },
        {
            "letter": "v",
            "color": "#f9ca24"
        },
        {
            "letter": "w",
            "color": "#40407a"
        },
        {
            "letter": "x",
            "color": "#b33939"
        },
        {
            "letter": "y",
            "color": "#aaa69d"
        },
        {
            "letter": "z",
            "color": "#341f97"
        }
    ]

    const getColorByLetter = () => {
        if(letter){
            const key = colorAndLetter.find(c => (
                c.letter.toLowerCase() === removeAccents(letter).toLowerCase()
            ))
            return key.color 
        }
        else return " "
    }

    return (
        <div className={styles.avatarContainer} >
            <div className={classes} style={{backgroundColor: getColorByLetter()}}>
                <p>{(letter && letter.toUpperCase()) || "N"}</p>
                {isOnline && <span className={styles.isOnline}></span> }
            </div>
        </div>
    )
}

export default Avatar