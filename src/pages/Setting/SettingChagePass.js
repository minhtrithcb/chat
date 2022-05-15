import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import authApi from '../../api/authApi'
import Button from '../../components/Common/Button/Button'
import Input from '../../components/Common/Form/Input'
import useLoading from '../../hooks/useLoading'
import useDecodeJwt from '../../hooks/useDecodeJwt'

const SettingChagePass = ({onSubmited}) => {

    const { register,  formState: { errors }, watch, handleSubmit, reset } = useForm();
    const [loading, setLoading, Icon] = useLoading()
    const [currentUser] = useDecodeJwt()

    const inputInit = {
        oldPassword: {
          label: "Mật khẩu Cũ", 
          type: "password", 
          name: "oldPassword", 
          placeholder: "Nhập mật khẩu Cũ",
          err: errors.oldPassword,
        },
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
        oldPassword: {
            required: true,
            minLength: 6,
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

    // Form submit
    const onSubmit = async ({oldPassword, password}) => {
        try {
            setLoading(true)
            const {data} = await authApi.resetwithOldPassword({
                oldPassword , 
                userId: currentUser.id, 
                password
            })
            if(data?.success) {
                toast.success(`${data.msg}`)
                setLoading(false)
                reset()
                onSubmited(true)
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
        <div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input  {...register("oldPassword", inpValid.oldPassword)}      {...inputInit.oldPassword} />
                <Input  {...register("password", inpValid.password)}      {...inputInit.password} />
                <Input  {...register("rePassword", inpValid.rePassword)}  {...inputInit.rePassword} />
                <Button disabled={loading} type="submit" primary size="lg" fluid style={{marginTop : "1em"}}> 
                    Đổi mật khẩu {loading && <Icon />}
                </Button>
            </form>
        </div>
    )
}

export default SettingChagePass