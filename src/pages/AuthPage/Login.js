import React, { useContext } from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import ImageDark from '../../assets/images/illu/Ss.png'
import clsx from 'clsx'
import { ThemeContext } from '../../context/ThemeContext'
import Button from '../../components/Button/Button'
import Input from '../../components/Form/Input'
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { Link } from 'react-router-dom'
const Login = () => {
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
          <h2>Login</h2>
          <Input label="Email" type="text" name="email" placeholder="Type your Email" />
          <Input label="Password" type="password" name="password" placeholder="Type your Password" />
          <Button primary size="lg" fluid style={{marginTop : "1em"}}> Login </Button>

          <div className={styles.LoginHr}>
            <hr />
            <p>Or Log in with</p>
          </div>

          <div className={styles.LoginSocial}>
            <span>
              <FcGoogle />
            </span>
            <span>
              <BsGithub/>
            </span>
          </div>

          <Link to="/sign-up">Don't have an account yet? Sign Up</Link>
          <Link to="/forgot-password">Forgot your password ?</Link>

        </div>
      </div>
    </div>
  )
}

export default Login