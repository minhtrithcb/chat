import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import Content from './Content'

const Theme = () => {

    const {toggle} = useContext(ThemeContext)
   
    return (
        <>
            <h1>Theme</h1>
            <button onClick={toggle}>Toggle</button>
            <Content />
        </>
    )
}

export default Theme