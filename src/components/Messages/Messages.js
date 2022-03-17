import React, { useContext, useEffect, useRef, useState } from 'react'
import FriendProfile from '../FriendProfile/FriendProfile';
import styles from "./Messages.module.scss"
import boy from '../../assets/images/boy.png'
import { FiAlignRight, FiMenu } from "react-icons/fi";
import Chat from '../Chat/Chat';
import { TiLocationArrow } from "react-icons/ti";
import { ThemeContext } from '../../context/ThemeContext';
import clsx from 'clsx';


const Messages = () => {

    const [toggle, setToggle] = useState(false)
    const {theme} = useContext(ThemeContext)
    const bottomRef = useRef()

    const curruntUser = {
        name: "Yasuo",
        id: 1
    } 

    const data = [
        {
            id: 1,
            converId: 1,
            sender: {
                id: 1,
                name: "Yasou"
            },
            text: "Mixins are defined using the @mixin at-rule, which is written @mixin <name> { ... } or @mixin name(<arguments...>) { ... }. A mixin’s name can be any Sass identifier, and it can contain any statement other than top-level statements. They can be used to encapsulate styles that can be dropped into a single style rule; they can contain style rules of their own that can be nested in other rules or included at the top level of the stylesheet; or they can just serve to modify variables."
        },
        {
            id: 2,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: "Argument lists can also be used to take arbitrary keyword arguments. The meta.keywords() function takes an argument list and returns any extra keywords that were passed to the mixin as a map from argument names (not including $) to those arguments’ values"
        },
        {
            id: 3,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: " The values of these expression are available within the mixin’s body as the corresponding variables."
        },
        {
            id: 4,
            converId: 1,
            sender: {
                id: 1,
                name: "Yasou"
            },
            text: "Because any argument can be passed by name,."
        },
        {
            id: 5,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: "In addition to taking arguments, a mixin can take an entire block of styles, known as a content block. A mixin can declare that it takes a content block by including the @content at-rule in its body. The content block is passed in using curly braces like any other block in Sass, and it’s injected in place of the @content rule."
        },
        {
            id: 6,
            converId: 1,
            sender: {
                id: 1,
                name: "Yasou"
            },
            text: "Mixins are defined using the @mixin at-rule, which is written @mixin <name> { ... } or @mixin name(<arguments...>) { ... }. A mixin’s name can be any Sass identifier, and it can contain any statement other than top-level statements. They can be used to encapsulate styles that can be dropped into a single style rule; they can contain style rules of their own that can be nested in other rules or included at the top level of the stylesheet; or they can just serve to modify variables."
        },
        {
            id: 21,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: "Argument lists can also be values"
        },
        {
            id: 33,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: " The values of these expression are available within the mixin’s body as the corresponding variables."
        },
        {
            id: 43,
            converId: 1,
            sender: {
                id: 1,
                name: "Yasou"
            },
            text: "Because any argument can be passed by name, be careful when renaming a mixin’s arguments… it might break your users! It can be helpful to keep the old name around as an optional argument for a while and printing a warning if anyone passes it, so they know to migrate to the new argument."
        },
        {
            id: 51,
            converId: 1,
            sender: {
                id: 4,
                name: "Ahri"
            },
            text: "In addition to taking arguments, a mixin can take an entire block of styles, known as a content block. A mixin can declare that it takes a content block by including the @content at-rule in its body. The content block is passed in using curly braces like any other block in Sass, and it’s injected in place of the @content rule."
        },
    ]

    const classesDarkMode = clsx(styles.conversation,{ 
        [styles.dark]: theme === "dark"
    })

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    //   bottomRef.current?.scrollIntoView();
      return () => {}
    }, [])
    
    return (
        <>
            <div className={classesDarkMode} >
                <div className={styles.friendCover}>
                    <div>
                        <div className={styles.avatar}>
                            <img src={boy} alt="friend" />
                        </div>
                        <span className={styles.des}>
                            <b>Yasuo</b>
                            <small>#yasuo15gg@gmail.com</small>
                        </span>
                    </div>

                    <div onClick={() => setToggle(prev => !prev)}>
                        {toggle ? <FiAlignRight /> : <FiMenu />}
                    </div>
                </div>
                
                <div className={styles.chatContainer} >
                    {data.map(chat => (
                        <Chat 
                            key={chat.id} 
                            self={chat.sender.id === curruntUser.id} 
                            data={chat} 
                        />
                    ))}
                </div>

                <div className={styles.chatForm} ref={bottomRef}>
                    <textarea ></textarea>
                    <div className={styles.sendBtn}>
                        <TiLocationArrow/>
                    </div>
                </div>
            </div>
            {toggle && <FriendProfile />}
        </>
    )
}

export default Messages