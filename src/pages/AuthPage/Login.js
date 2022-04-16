import React, { useContext, useEffect, useState } from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const { register,  formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const [emailFromSignIn, setEmailFromSignIn] = useState("")
  const navigate = useNavigate();
  const location = useLocation()
  const {setAuth} = useContext(AuthContext)
  const from = location.state?.from?.pathname || "/"
  
  const inputInit = {
    email: {
      label: "Địa chỉ email", 
      type: "email", 
      name: "email", 
      placeholder: "Nhập địa chỉ email",
      err: errors.email,
    },
    password: {
      label: "Mật khẩu", 
      type: "password", 
      name: "password", 
      placeholder: "Nhập mật khẩu",
      err: errors.password,
    }
  }

  const inpValid = {
    email: {
      required: true,
      minLength: 6,
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: "không hợp lệ" 
      }
    },
    password: {
      required: true,
      minLength: 6,
    }
  }

  // Effect when user sign up & redirect to login
  useEffect(() => {
    if (location.state?.email)
      setEmailFromSignIn(location.state.email)
  }, [location])
  
  // Form submit
  const onSubmit = async ({email, password}) => {
    try {
      setLoading(true)
      let {data} = await authApi.login(email, password)
      if(data?.success) {
        toast.success(`Đăng nhập thành công`)
        setLoading(false)
        setAuth({isLogin: true, accessToken:  data.accessToken, loading: false})
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
          <h2>Đăng nhập</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input  {...register("email", inpValid.email)} defaultValue={emailFromSignIn ?? ""}  {...inputInit.email}  />
            <Input  {...register("password", inpValid.password)} {...inputInit.password} />
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              Đăng nhập {loading && <Icon />}
            </Button>
          </form>
          <div className={styles.LoginHr}>
            <hr />
            <p>Hoặc đăng phận với</p>
          </div>

          <div className={styles.LoginSocial}>
            <span>
              <FcGoogle />
            </span>
            <span>
              <BsGithub/>
            </span>
          </div>

          <Link to="/sign-up">Không có tài khoản? đăng ký ngay.</Link>
          <Link to="/forgot-password">Quên mật khẩu?</Link>

        </div>
      </div>
    </div>
  )
}

export default Login