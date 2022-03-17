import React, { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'

const Paraph = () => {

  const {theme} = useContext(ThemeContext)

  return (
    <p> <b>{theme} </b>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis nostrum possimus, harum modi qui repudiandae sit accusantium suscipit hic delectus, cum vel non neque eos.</p>
  )
}

export default Paraph