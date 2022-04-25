import React, {  useEffect, useState} from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/Ss.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'
import ReCAPTCHA from "react-google-recaptcha";

const VerifyEmail = () => {
  const { register,  formState: { errors }, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const navigate = useNavigate();
  const location = useLocation()
  const [emailVetify, setEmailVetify] = useState('')
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
  
  // Redirect if user not from sing Up or Login
  useEffect(() => {
    if (location.state === null) {
      navigate(-1)
    } else if(location.state.email) {
      setEmailVetify(location.state.email)
    }
  }, [location, navigate])
  

  // Form submit
  const onSubmit = async ({email}) => {
    try {
      // setLoading(true)
      console.log(email);
    } catch (error) {
      setLoading(false)
      toast.error(`${error}`)
    }
  }

  function onChange(value) {
    console.log("Captcha value:", value);
  }

  return (<>
    {location.state !== null && emailVetify !== '' && <div className={styles.LoginContainer}>
      <div className={styles.LoginImg}>
        <img src={ImageLight} alt="vetifyImg" />
      </div>
      <div className={styles.LoginSide}>
        <div className={styles.LoginForm}>
          <h2>Xác thực tài khoản</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input  {...register("email", inpValid.email)} defaultValue={emailVetify}  {...inputInit.email}  />
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              Xác thực {loading && <Icon />}
            </Button>
          </form>
          <small>Chúng tôi sẻ gửi bạn mã xác thực vào email của bạn</small>
          <ReCAPTCHA
            className={styles.captcha}
            sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
            onChange={onChange}
          />
          <div className={styles.LoginHr}>
            <hr />
            <p>Hoặc thử</p>
          </div>
          <Link to="/login">Đăng nhập?</Link>
          <Link to="/sign-up">Không có tài khoản? đăng ký ngay.</Link>

        </div>
      </div>
    </div>}
    </>
  )
}

export default VerifyEmail