import React from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/s.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../../api/authApi'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'

const ForgotPass = () => {
  const { register,  formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const navigate = useNavigate();
  
  const inputInit = {
    email: {
      label: "Địa chỉ email", 
      type: "email", 
      name: "email", 
      placeholder: "Nhập địa chỉ email",
      err: errors.email,
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
    }
  }
  
  // Form submit
  const onSubmit = async ({email}) => {
    try {
        setLoading(true)
        let {data} = await authApi.forgotPassword(email)
        if(data?.success) {
            setLoading(false)
            toast.success(`Gửi yêu cầu thành công`)
            navigate('/change-password', {replace: true})
        } else setLoading(false)
    } catch (error) {
        setLoading(false)
    }
  }

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.LoginImg}>
        <img src={ImageLight} alt="loginImg" />
      </div>
      <div className={styles.LoginSide}>
        <div className={styles.LoginForm}>
          <h2>Quên mật khẩu</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input  {...register("email", inpValid.email)}  {...inputInit.email}  />
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              Gửi  {loading && <Icon />}
            </Button>
          </form>
          <div className={styles.LoginHr}>
            <hr />
            <p>Hoặc thử với</p>
          </div>

          <Link to="/sign-up">Không có tài khoản? đăng ký ngay.</Link>
          <Link to="/login">Đăng nhập ?</Link>

        </div>
      </div>
    </div>
  )
}

export default ForgotPass