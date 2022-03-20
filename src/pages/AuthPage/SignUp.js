import React from 'react'
import styles from './Auth.module.scss'
import ImageDark from '../../assets/images/illu/Ss.png'
import Button from '../../components/Button/Button'
import Input from '../../components/Form/Input'
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
        label: "FullName", 
        type: "text", 
        name: "fullname", 
        placeholder: "Type your Fullname",
        err: errors.fullname
      },
      email: {
        label: "Email", 
        type: "email", 
        name: "email", 
        placeholder: "Type your Email",
        err: errors.email
      },
      password: {
        label: "Password", 
        type: "password", 
        name: "password", 
        placeholder: "Type your Password",
        err: errors.password
      },
      rePassword: {
        label: "Retype password", 
        type: "password", 
        name: "rePassword", 
        placeholder: "Type your Password again",
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
          message: "is not an email"
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
            return "Your passwords do no match";
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
            navigate("/login")
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
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input  {...register("fullname", inpValid.fullname)}      {...inputInit.fullname} />
              <Input  {...register("email", inpValid.email)}            {...inputInit.email} />
              <Input  {...register("password", inpValid.password)}      {...inputInit.password} />
              <Input  {...register("rePassword", inpValid.rePassword)}  {...inputInit.rePassword} />
              <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> Sign Up 
                {loading && <Icon />}
              </Button>
            </form>
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