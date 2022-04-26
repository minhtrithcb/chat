import React, {  useEffect, useRef, useState} from 'react'
import styles from './Auth.module.scss'
import ImageLight from '../../assets/images/illu/Ss.png'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useLoading from '../../hooks/useLoading'
import { toast } from 'react-toastify'
import ReCAPTCHA from "react-google-recaptcha";
import authApi from '../../api/authApi'

const VerifyEmail = () => {
  const { register,  formState: { errors }, watch, handleSubmit } = useForm();
  const [loading, setLoading, Icon] = useLoading()
  const navigate = useNavigate();
  const location = useLocation()
  const [emailVetify, setEmailVetify] = useState('')
  const reCaptchaRef = useRef(null)
  const [isSentVerify, setIsSentVerify] = useState(false)
  const inputInit = {
    email: {
      label: "Địa chỉ email", 
      type: "email", 
      name: "email", 
      placeholder: "Nhập địa chỉ email",
      err: errors.email,
    },
    otp: {
      label: "Mã OTP",
      type: "password",
      name: "otp",
      placeholder: "Nhập mã otp trong email",
      err: errors.otp,
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
    otp : {
      require: true,
      minLength: 4,
      maxLength: 4,
      pattern: {
        value: /^[0-9]+$/,
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
  const onSubmit = async ({email, otp}) => {
    try {
      setLoading(true)
      // Cet Captcha
      const captcha = await reCaptchaRef.current.executeAsync();
      // Captcha checking
      if (captcha !== '' && captcha !== null && captcha !== undefined) {
        // if user have sent otp
        if (isSentVerify) {
          const {data} = await authApi.checkVerifyOTP(email, otp)
          if (data.success) {
            toast.success(`${data.msg}`)
            navigate('/login', {replace: true})
          } else {
            setLoading(false)
            toast.error(`${data.msg}`)
          }
          // if user not sent otp 
        } else {
          const {data} = await authApi.sendVerify(email)
          if (data.success) {
            setLoading(false)
            toast.success(`${data.msg}`)
            // sent success chage flag 
            setIsSentVerify(true)
          } else {
            setLoading(false)
            toast.error(`${data.msg}`)
          }
        }
      // captcha fail
      } else {
        setLoading(false)
        toast.error(`Hãy xác thực captcha`)
      }
    } catch (error) {
      setLoading(false)
      toast.error(`${error}`)
    }
  }

  // Re sent OTP
  const reSentOTP = async () => {
    const {data} = await authApi.sendVerify(watch('email'))
    if (data.success) {
      toast.success(`${data.msg}`)
    } else {
      toast.error(`${data.msg}`)
    }
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
            {isSentVerify && <Input  {...register("otp", inpValid.otp)} {...inputInit.otp}  />}
            <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
              {isSentVerify ? "Xác thực OTP" : "Gửi email"} {loading && <Icon />}
            </Button>
          </form>
          {!isSentVerify ? <small>Chúng tôi sẻ gửi bạn mã xác thực vào email của bạn</small>: 
           <small onClick={reSentOTP} style={{cursor: "pointer"}}>Gửi lại mã OTP </small> }
          <div className={styles.LoginHr}>
            <hr />
            <p>Hoặc thử</p>
          </div>
          <Link to="/login">Đăng nhập?</Link>
          <Link to="/sign-up">Không có tài khoản? đăng ký ngay.</Link>
        </div>
      </div>
      <ReCAPTCHA
        ref={reCaptchaRef}
        className={styles.captcha}
        size={"invisible"}
        sitekey={process.env.REACT_APP_GOOGLE_SITE_KEY}
      />
    </div>}
    </>
  )
}

export default VerifyEmail