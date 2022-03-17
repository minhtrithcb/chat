import React from 'react'
import styles from './Form.module.scss'

const Input = ({type, name, placeholder, label, ...rest}) => {
  return (
    <div className={styles.FromInput}>
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} id={name} placeholder={placeholder} {...rest} />
    </div>
  )
}

export default Input