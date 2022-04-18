import clsx from 'clsx'
import React, { forwardRef } from 'react'
import useTheme from '../../../hooks/useTheme'
import styles from './Form.module.scss'

const Input = ({type, name, placeholder, label, err, ...rest}, ref) => {
  const {theme} = useTheme()
  const classesDarkMode = clsx(styles.FromInput,{ 
      [styles.dark]: theme === "dark"
  })
  return (
    <div className={classesDarkMode}>
        <label htmlFor={name}>{label}</label>
        <input type={type} name={name} id={name} placeholder={placeholder} ref={ref} {...rest} />
        <small>
          {err?.type === 'required' && `${label} không được bỏ trống`}
        </small>
    
        <small>
          {err?.type === 'minLength' && `${label} không được quá ngắn`}
        </small>

        <small>
          {err?.type === 'maxLength' && `${label} không được quá dài`}
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