import React, { useEffect, useState} from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import {useNavigate, useParams } from 'react-router-dom'
import authApi from '../../api/authApi'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'

const ChangePass = () => {
  const { register,  formState: { errors }, watch, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const [userId, setUserId] = useState('')
  const navigate = useNavigate();
  const {token} = useParams()

  const inputInit = {
    password: {
      label: "Mật khẩu", 
      type: "password", 
      name: "password", 
      placeholder: "Nhập mật khẩu",
      err: errors.password,
    },
    rePassword: {
      label: "Nhập lại mật khẩu", 
      type: "password", 
      name: "rePassword", 
      placeholder: "Nhập lại mật khẩu",
      err: errors.rePassword
    }
  }

  const inpValid = {
    password: {
      required: true,
      minLength: 6,
    },
    rePassword: {
      required: true,
      minLength: 6,
      validate: value => {
        if (watch('password') !== value) {
          return "Mật khẩu nhập lại không khớp";
        }
      }
    },
  }

    // Redirect if token exprire
    useEffect(() => {
        const checkValidToken = async () => {
          const {data} = await authApi.checkValidResetPass(token)
          if (!data?.success) {
            navigate('/forgot-password', {replace: true})
            toast.error(`${data?.msg}`)
          }else {
            setUserId(data._id)
          }
        }
        checkValidToken()
    }, [navigate, token])
  
  // Form submit
  const onSubmit = async ({password}) => {
    try {
      setLoading(true)
      const {data} = await authApi.resetPassword(userId, password)
      if(data?.success) {
        toast.success(`${data.msg}`)
        setLoading(false)
        navigate("/login", {replace: true})
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
          <h2>Đổi mật khẩu</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input  {...register("password", inpValid.password)}      {...inputInit.password} />
            <Input  {...register("rePassword", inpValid.rePassword)}  {...inputInit.rePassword} />
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              Đổi mật khẩu {loading && <Icon />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePass