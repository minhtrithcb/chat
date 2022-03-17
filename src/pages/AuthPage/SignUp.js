import React, { useContext } from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import ImageDark from '../../assets/images/illu/Ss.png'
import clsx from 'clsx'
import { ThemeContext } from '../../context/ThemeContext'
import Button from '../../components/Button/Button'
import Input from '../../components/Form/Input'
import { Link } from 'react-router-dom'
const SignUp = () => {
  const {theme} = useContext(ThemeContext)

  const classesDark = clsx(styles.LoginContainer, {
    [styles.dark]: theme === "dark"
  })

  const ImageSrc = theme === "light" ? ImageLight : ImageDark

  return (
    <div className={classesDark}>
      <div className={styles.LoginImg}>
        <img src={ImageSrc} alt="loginImg" />
      </div>
      <div className={styles.LoginSide}>
        <div className={styles.LoginForm}>
          <h2>Sign Up</h2>
          <Input label="Email" type="text" name="fullname" placeholder="Type your Fullname" />
          <Input label="Email" type="text" name="email" placeholder="Type your Email" />
          <Input label="Password" type="password" name="password" placeholder="Type your Password" />
          <Input label="Retype password" type="password" name="re-password" placeholder="Type your password again" />
          <Button primary size="lg" fluid style={{marginTop : "1em"}}> Sign Up </Button>

          <div className={styles.LoginHr}>
            <hr />
            <p>Or try with</p>
          </div>

          <Link to="/login">Have an account ! Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp