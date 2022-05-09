import React, { useContext, useEffect, useState } from 'react'
import styles from './MasterGroupOption.module.scss'
import Model from '../Common/Model/Model'
import { IoSettingsOutline } from "react-icons/io5";
import Button from '../Common/Button/Button';
import ChoseRadius from '../Common/ChoseRadius/ChoseRadius';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Input from '../Common/Form/Input';
import TextArea from '../Common/Form/TextArea';
import { useForm } from 'react-hook-form';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChatContext } from '../../context/ChatContext';
import Alert from '../Common/Alert/Alert';
import { toast } from 'react-toastify';
import converApi from '../../api/converApi';
import { useNavigate } from 'react-router-dom';

const OptionEdit = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { register,  formState: { errors }, reset, handleSubmit } = useForm();
    const [privacy, setPrivacy] = useState('pu')
    const [ruleGroup, setRuleGroup] = useState('')
    const {currentChat, setChatsOption, setCurrentChat} = useContext(ChatContext)
    const [isAlert, setIsAlert] = useState(false) 
    // const copyRef = useRef(null)
    const navigate = useNavigate();

    useEffect(() => {
      setPrivacy(() => currentChat.private ? "pr" : 'pu')
    }, [currentChat])
    

    const inputInit = {
        nameGroup: {
          label: "Tên nhóm", 
          type: "text", 
          name: "nameGroup", 
          placeholder: "Nhập tên nhóm",
          err: errors.nameGroup,
          defaultValue: currentChat?.name
        },
        desGroup: {
            label: "Mô tả nhóm", 
            type: "text", 
            name: "desGroup", 
            placeholder: "Nhập mô tả cho nhóm",
            err: errors.desGroup,
            defaultValue: currentChat?.des
        },
    }
    
    const inpValid = {
        nameGroup: {
          required: true,
          minLength: 6,
        },
    }

    const onSubmit = async data => {
        try {
            const res = await converApi.editGroupConver({
                roomId: currentChat._id,
                name: data.nameGroup,
                des: data.desGroup,
                rule: ruleGroup,
                privacy: privacy === "pr" ? true : false
            })
            if (res.data?.success) {
                prevQuit(true)
                toast.success(`Cập nhật nhóm thành công`)
                setChatsOption({type: 'Group', title: "Tin nhắn nhóm"})
                setCurrentChat(res.data.result)
                navigate('/', {replace: true})
            }
        } catch (error) {
            console.log(error);
        }
    }   

    // Prev form not save
    const prevQuit = (chose) => {
        if (chose) {
            reset()
            setIsOpen(false)
        } 
        setPrivacy(() => currentChat.private ? "pr" : 'pu')
        setIsAlert(false)
    }

    // Copy to clipboard
    // const handleCopy = () => {
    //     copyRef.current.select();
    //     copyRef.current.setSelectionRange(0, 99999);
    //     navigator.clipboard.writeText(copyRef.current.value);
    //     toast.success('Sao chép đường dẫn thành công')
    // }

    return (
        <>
            <span
                title='Cài đặt' 
                onClick={() => setIsOpen(true)}>
                <IoSettingsOutline />
            </span>
            <Model 
                isOpen={isOpen} 
                handleClick={() => setIsAlert(true)} 
                heading={'Cài đặt'}
                prevLostData={() => setIsAlert(true)}
            >
                {/* Form  */}
                {/* <h4>Tạo link mời</h4>
                <div className={styles.linkInviteGroup}>
                    <input type="text" readOnly={true} defaultValue={currentChat?.inviteCode} ref={copyRef} />
                    <button onClick={handleCopy}>Sao chép</button>
                </div> */}
                <h4>Cập nhật thông tin nhóm</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input  {...register("nameGroup", inpValid.nameGroup)} {...inputInit.nameGroup} />
                    <TextArea  {...register("desGroup")} {...inputInit.desGroup} />
                    <label>Quy tắc nhóm</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        config={{
                            removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
                        }}
                        data={currentChat?.rule}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setRuleGroup(data)
                        }}
                    />
                    <label>Tính riêng tư</label>
                    <div className={styles.flex}>
                        <ChoseRadius 
                            text="Bất kể ai cũng có thể tham gia nhóm này"
                            title={"Công khai"}
                            active={privacy === "pu"}
                            onClick={() => setPrivacy('pu')}
                        />
                        <ChoseRadius 
                            text="Chỉ có thể tham gia nhóm này qua đường dẫn"
                            title={"Riêng tư"}
                            active={privacy === "pr"}
                            onClick={() => setPrivacy('pr')}
                        />
                    </div>
                    {/* // Footer Button  */}
                    <div className={styles.footer}>
                        <Button 
                            type="submit" 
                            primary 
                            fluid
                            size={'lg'}
                        >
                            Lưu lại
                        </Button>
                    </div>
                </form>
            </Model>
            <Alert 
                heading={'Cảnh báo'}
                text={'Bạn chưa lưu lại dữ liệu, bạn có muốn rời đi không'}
                isOpen={isAlert} 
                userComfirm={prevQuit} 
            />
        </>
    )
}

export default OptionEdit