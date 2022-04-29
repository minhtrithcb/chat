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

const ConversationOption = () => {
    const options = [
      { value: 'All', label: 'Tất cả tin nhắn' },
      { value: 'Group', label: 'Tin nhắn nhóm' },
      { value: 'Friend', label: 'Tin nhắn bạn bè' }
    ]
    const [addFriend, setAddFriend] = useState([])
    const [isOpen, setIsOpen] = useState(false) // main model
    const [isOpen2, setIsOpen2] = useState(false) // chose friend model
    const [isOpen3, setIsOpen3] = useState(false) // prev quit model
    const { register,  formState: { errors }, reset, handleSubmit } = useForm();
    const {friendList, setFriendList} = useContext(FriendContext)
    const {chatsOption, setChatsOption} = useContext(ChatContext)
    const [currentUser] = useDecodeJwt()
    const [sender, setSender] = useState(null)
    const [errorNoMember, setErrorNoMember] = useState(false)
    const {theme} = useTheme()
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
        }
    }
    
    const inpValid = {
        nameGroup: {
          required: true,
          minLength: 6,
        }
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
                const res = await converApi.createGroptConver({
                    members: [...addFriend, sender],
                    nameGroup: data.nameGroup,
                    owner: sender._id
                })
                if (res.data?.success) {
                    toast.success(`Tạo nhóm thành công`)
                    prevQuit(true)
                    setChatsOption({type:  'All', title: 'Tất cả tin nhắn'})
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
        setErrorNoMember(false)
        setIsOpen3(false)
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
                    options={options} 
                    onChange={handleChangeOption}
                    defaultValue={renderDefOption} 
                />
                <span onClick={() => setIsOpen(true) }>
                    <AiOutlinePlus />
                </span>
            </div>
            {/* Main model */}
            <Model 
                isOpen={isOpen} 
                handleClick={() => setIsOpen3(true)} 
                heading="Tạo nhóm"
                prevLostData={() => setIsOpen3(true)}
            >
                {/* Form  */}
                 <form onSubmit={handleSubmit(onSubmit)}>
                    <Input  {...register("nameGroup", inpValid.nameGroup)} {...inputInit.nameGroup} />
                    <label>Thêm thành viên</label>
                    <div className={styles.friendList}>
                        {addFriend.map(f => (
                            <FriendItem 
                                key={f._id} 
                                friend={f} 
                                inAddFriend={addFriend.some(u => u._id === f._id)}
                                onClick={handleClick} 
                            />
                        ))}
                    </div>
                    {/* // Button Add Friend */}
                    <span className={styles.optionAddPeople} onClick={() => setIsOpen2(true) }>
                        <AiOutlinePlus />
                    </span>
                    {errorNoMember && <small className={styles.errorText}>Hãy thêm ít nhất 2 thành viên</small>}
                    {/* // Footer Button  */}
                    <div className={styles.footer}>
                        <Button size={'lg'} onClick={() => setIsOpen3(true)}>Thoát</Button>
                        <Button 
                            type="submit" 
                            primary 
                            size={'lg'}
                        >
                            Tạo nhóm
                        </Button>
                    </div>
                </form>
                {/* Chose friend model */}
                <Model 
                    isOpen={isOpen2} 
                    handleClick={setIsOpen2} 
                    heading="Thêm thành viên"
                > 
                    {friendList && friendList.map(f => (
                        <FriendItem 
                            key={f._id} 
                            friend={f} 
                            inAddFriend={addFriend.some(u => u._id === f._id)}
                            onClick={handleClick} 
                        />
                    ))}
                </Model>
            </Model>
            {/* Prev quit model */}
            <Alert 
                heading={'Cảnh báo'}
                text={'Bạn chưa lưu lại dữ liệu, bạn có muốn rời đi không'}
                isOpen={isOpen3} 
                userComfirm={prevQuit} 
            />
        </div>
    )
}

export default ConversationOption