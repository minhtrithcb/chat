import React, { forwardRef } from 'react'
import styles from './Form.module.scss'


const Input = ({type, name, placeholder, label, err, ...rest}, ref) => {

  return (
    <div className={styles.FromInput}>
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} id={name} placeholder={placeholder} ref={ref} {...rest} />
        <small>
          {err?.type === 'required' && `${label} is required`}
        </small>
    
        <small>
          {err?.type === 'minLength' && `${label} is too short`}
        </small>

        <small>
          {err?.type === 'maxLength' && `${label} is too long`}
        </small>

        <small>
          {err?.type === 'pattern' && `${label} ${err?.message}`}
        </small>

        <small>
          {err?.type === 'validate' && `${err?.message}`}
        </small>
    </div>
  )
}

export default forwardRef(Input)