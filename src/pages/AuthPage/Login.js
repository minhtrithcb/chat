import React from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import Button from '../../components/Button/Button'
import Input from '../../components/Form/Input'
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'
import useAuth from '../../hooks/useAuth'

const Login = () => {
  const { register,  formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const navigate = useNavigate();
  const location = useLocation()
  const {setAuth} = useAuth();
  const from = location.state?.from?.pathname || "/"
  
  const inputInit = {
    email: {
      label: "Email", 
      type: "email", 
      name: "email", 
      placeholder: "Type your Email",
      value: "minhtrithcb@gmail.com",
      err: errors.email
    },
    password: {
      label: "Password", 
      type: "password", 
      name: "password", 
      placeholder: "Type your Password",
      value: "123456",
      err: errors.password
    }
  }

  const inpValid = {
    email: {
      required: true,
      minLength: 6,
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: "is not an email"
      }
    },
    password: {
      required: true,
      minLength: 6,
    }
  }

  const onSubmit = async ({email, password}) => {
    try {
      setLoading(true)
      let {data} = await authApi.login(email, password)
      if(data?.success) {
        toast.success(`Đăng nhập thành công`, {autoClose: 2000, hideProgressBar: true})
        setLoading(false)
        setAuth({isLogin: true, accessToken:  data.accessToken})
        navigate(from, {replace: true})
      } else {
        toast.error(`${data?.msg}`)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.error(`${error}`)
    }
  }

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.LoginImg}>
        <img src={ImageLight} alt="loginImg" />
      </div>
      <div className={styles.LoginSide}>
        <div className={styles.LoginForm}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input  {...register("email", inpValid.email)} {...inputInit.email} />
            <Input  {...register("password", inpValid.password)} {...inputInit.password} />
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              Login {loading && <Icon />}
            </Button>
          </form>

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
          <Link to="/admin">Forgot your password ?</Link>

        </div>
      </div>
    </div>
  )
}

export default Login