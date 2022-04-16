import React from 'react'
import styles from './Auth.module.scss'
import ImageDark from '../../assets/images/illu/Ss.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import authApi from '../../api/authApi'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'

const SignUp = () => {
    const { register,  formState: { errors }, handleSubmit , watch} = useForm();
    const [loading, setLoading, Icon] = useLoading()
    const navigate = useNavigate();

    const inputInit = {
      fullname : {
        label: "Họ và Tên", 
        type: "text", 
        name: "fullname", 
        placeholder: "Nhập họ và tên",
        err: errors.fullname
      },
      email: {
        label: "Địa chỉ email", 
        type: "email", 
        name: "email", 
        placeholder: "Nhập địa chỉ email",
        err: errors.email
      },
      password: {
        label: "Mật khẩu", 
        type: "password", 
        name: "password", 
        placeholder: "Nhập mật khẩu",
        err: errors.password
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
      fullname: {
        required: true,
        minLength: 6,
        maxLength: 30,
      },
      email: {
        required: true,
        minLength: 6,
        pattern: {
          value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
          message: 'Email không hợp lệ'
        }
      },
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

    const onSubmit = async ({fullname, email, password}) => {
      try {
        setLoading(true)
        let {data} = await authApi.signup(fullname, email, password)
        if(data?.success) {
          toast.success(`${data?.msg}`)
          setTimeout(()=> {
            navigate('/login', {state: {
              email: watch('email'),
            }})
            setLoading(false)
          },3000)
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
          <img src={ImageDark} alt="loginImg" />
        </div>
        <div className={styles.LoginSide}>
          <div className={styles.LoginForm}>
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input  {...register("fullname", inpValid.fullname)}      {...inputInit.fullname} />
              <Input  {...register("email", inpValid.email)}            {...inputInit.email} />
              <Input  {...register("password", inpValid.password)}      {...inputInit.password} />
              <Input  {...register("rePassword", inpValid.rePassword)}  {...inputInit.rePassword} />
              <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
                Đăng ký
                {loading && <Icon />}
              </Button>
            </form>
            <div className={styles.LoginHr}>
              <hr />
              <p>Hoặc thử với</p>
            </div>
            <Link to="/login">Có tài khoản ! Đăng nhập</Link>
          </div>
        </div>
      </div>
    )
}

export default SignUp