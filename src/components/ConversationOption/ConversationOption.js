import React, { useContext, useEffect, useState } from 'react'
import Model from '../Common/Model/Model'
import styles from './ConversationOption.module.scss'
import Select from 'react-select'
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from 'react-hook-form';
import Input from '../Common/Form/Input';
import { FriendContext } from '../../context/FriendContext';
import userApi from '../../api/userApi';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import Button from '../Common/Button/Button'
import FriendItem from './FriendItem';
import Alert from '../Common/Alert/Alert';
import converApi from '../../api/converApi';
import { toast } from 'react-toastify';
import { ChatContext } from '../../context/ChatContext';
import clsx from 'clsx';
import useTheme from '../../hooks/useTheme'
import { SocketContext } from '../../context/SocketContext';
import TextArea from '../Common/Form/TextArea';
import ChoseRadius from '../Common/ChoseRadius/ChoseRadius';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import chatApi from '../../api/chatApi';

const ConversationOption = () => {
    const options = [
      { value: 'All', label: 'Tất cả tin nhắn' },
      { value: 'Group', label: 'Tin nhắn nhóm' },
      { value: 'Friend', label: 'Tin nhắn bạn bè' }
    ]
    const [addFriend, setAddFriend] = useState([])
    const [isOpen, setIsOpen] = useState(false) 
    const [isAlert, setIsAlert] = useState(false) 
    const { register,  formState: { errors }, reset, handleSubmit } = useForm();
    const {friendList, setFriendList} = useContext(FriendContext)
    const {chatsOption, setChatsOption} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const [sender, setSender] = useState(null)
    const [errorNoMember, setErrorNoMember] = useState(false)
    const {theme} = useTheme()
    const {socket} = useContext(SocketContext)
    const [privacy, setPrivacy] = useState('pu')
    const [ruleGroup, setRuleGroup] = useState('')
    const classesDarkMode = clsx(styles.optionContainer,{ 
        [styles.dark]: theme === "dark",
    })

    const inputInit = {
        nameGroup: {
          label: "Tên nhóm", 
          type: "text", 
          name: "nameGroup", 
          placeholder: "Nhập tên nhóm",
          err: errors.nameGroup,
        },
        desGroup: {
            label: "Mô tả nhóm", 
            type: "text", 
            name: "desGroup", 
            placeholder: "Nhập mô tả cho nhóm",
            err: errors.desGroup,
        },
        welcomeTextGroup: {
            label: "Lời chào khi tạo nhóm", 
            type: "text", 
            name: "welcomeTextGroup", 
            defaultValue: "Chào mừng các bạn đã tham gia nhóm",
            placeholder: "Nhập lời chào khi tạo",
            err: errors.desGroup,
        }
    }
    
    const inpValid = {
        nameGroup: {
          required: true,
          minLength: 6,
        },
    }

    // Fetch friendList & sender user obj
    useEffect(() => {
        let isMounted = true
        const getFriendList = async () => {
            if(isOpen === true) {
                const {data} = await userApi.getFriendUser(currentUser.id)
                const res = await userApi.getByUserId(currentUser.id)
                if (isMounted) 
                    setSender(res.data)
                    setFriendList(data)
            }
        }

        getFriendList()
        return () => { isMounted = false };
    }, [currentUser.id, setFriendList, isOpen])
    
    // Add or remove
    const handleClick = (friend) => {
        const found = addFriend.find(user => friend._id === user._id)
        if (!found) {
            setAddFriend(prev => [...prev, friend])
        } else {
            setAddFriend(prev => prev.filter(u => u._id !== friend._id))
        }
        setErrorNoMember(false)
    }

    // Submit form
    const onSubmit = async data => {
        if (addFriend.length >= 2) {
            setErrorNoMember(false)
            try {
                const allReciver = [...addFriend, sender]
                const res = await converApi.createGroptConver({
                    members: allReciver,
                    nameGroup: data.nameGroup,
                    owner: sender._id,
                    des : data.desGroup,
                    rule: ruleGroup,
                    privacy: privacy === "pr" ? true : false
                })
                if (res.data?.success) {
                    toast.success(`Tạo nhóm thành công`)

                    const saved = await chatApi.postNewChat({
                        roomId: res.data.saved._id,
                        sender: currentUser.id,
                        text:   data.welcomeTextGroup,
                    })
                    // Send to socket room
                    socket.emit("send-msg", saved)
                    // Send to socket id
                    socket.emit("sendToFriendOnline", { 
                        recivers : allReciver, 
                        ...saved
                    })

                    socket.emit("send-createGroup", {  
                        recivers: allReciver, 
                        sender: currentUser.id, 
                        group : res.data.saved
                    })
                    prevQuit(true)
                }
            } catch (error) {
                console.log(error);
            }            
        } else { 
            setErrorNoMember(true)
        }
    }

    // Prev form not save
    const prevQuit = (chose) => {
        if (chose) {
            reset()
            setIsOpen(false)
            setAddFriend([])
        } 
        setPrivacy('pu')
        setErrorNoMember(false)
        setIsAlert(false)
    }

    // Render default option
    const renderDefOption = () => {
        return options.filter(o => o.value === chatsOption.type)
    }

    // Change option
    const handleChangeOption = (e) => {
        setChatsOption({type: e.value, title: e.label});
    }

    return (
        <div className={classesDarkMode}>
            <div className={styles.optionBox}>
                <Select  
                    isSearchable={false}
                    options={options} 
                    onChange={handleChangeOption}
                    defaultValue={renderDefOption} 
                />
                <span onClick={() => setIsOpen(true) } title="Tạo nhóm">
                    <AiOutlinePlus />
                </span>
            </div>
            {/* Main model */}
            <Model 
                isOpen={isOpen} 
                handleClick={() => setIsAlert(true)} 
                heading="Tạo nhóm"
                prevLostData={() => setIsAlert(true)}
            >
                {/* Form  */}
                 <form onSubmit={handleSubmit(onSubmit)}>
                    <Input  {...register("nameGroup", inpValid.nameGroup)} {...inputInit.nameGroup} />
                    <Input  {...register("welcomeTextGroup")} {...inputInit.welcomeTextGroup} />
                    <TextArea  {...register("desGroup")} {...inputInit.desGroup} />
                    <label>Quy tắc nhóm</label>
                    <CKEditor
                        editor={ ClassicEditor }
                        config={{
                            removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload', 'MediaEmbed'],
                        }}
                        data=""
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
                    <label>Thêm thành viên</label>
                    <div className={styles.friendList}>
                         {friendList && friendList.map(f => (
                            <FriendItem 
                                key={f._id} 
                                friend={f} 
                                inAddFriend={addFriend.some(u => u._id === f._id)}
                                onClick={handleClick} 
                            />
                        ))}
                    </div>
                    {errorNoMember && <small className={styles.errorText}>Hãy thêm ít nhất 2 thành viên</small>}
                    {/* // Footer Button  */}
                    <div className={styles.footer}>
                        <Button 
                            type="submit" 
                            primary 
                            fluid
                            size={'lg'}
                        >
                            Tạo nhóm
                        </Button>
                    </div>
                </form>
            </Model>
            {/* Prev quit model */}
            <Alert 
                heading={'Cảnh báo'}
                text={'Bạn chưa lưu lại dữ liệu, bạn có muốn rời đi không'}
                isOpen={isAlert} 
                userComfirm={prevQuit} 
            />
        </div>
    )
}

export default ConversationOption