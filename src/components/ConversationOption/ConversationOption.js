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


const ConversationOption = () => {
    const options = [
      { value: '1', label: 'Tất cả tin nhắn' },
      { value: '2', label: 'Tin nhắn nhóm' },
      { value: '3', label: 'Tin nhắn bạn bè' }
    ]
    const [addFriend, setaAddFriend] = useState([])
    const [isOpen, setIsOpen] = useState(false) // main model
    const [isOpen2, setIsOpen2] = useState(false) // chose friend model
    const [isOpen3, setIsOpen3] = useState(false) // prev quit model
    const { register,  formState: { errors }, reset, handleSubmit } = useForm();
    const [currentUser] = useDecodeJwt()
    const {friendList, setFriendList} = useContext(FriendContext)

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

    // Fetch friendList 
    useEffect(() => {
        let isMounted = true
        const getFriendList = async () => {
            const {data} = await userApi.getFriendUser(currentUser.id)
            if (isMounted) setFriendList(data)
        }

        getFriendList()
        return () => { isMounted = false };
    }, [currentUser.id, setFriendList])
    
    // Add or remove
    const handleClick = (friend) => {
        const found = addFriend.find(user => friend._id === user._id)
        if (!found) {
            setaAddFriend(prev => [...prev, friend])
        } else {
            setaAddFriend(prev => prev.filter(u => u._id !== friend._id))
        }
    }

    // Submit form
    const onSubmit = data => {
        console.log(data);
    }


    // Prev form not save
    const prevQuit = (chose) => {
        if (chose) {
            reset()
            setIsOpen(false)
            setIsOpen3(false)
            setaAddFriend([])
        } else {
            setIsOpen3(false)
        }
    }

    return (
        <div className={styles.optionContainer}>
            <div className={styles.optionBox}>
                <Select options={options} defaultValue={options[0]} />
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
                    <span className={styles.optionAddPeople} onClick={() => setIsOpen2(true) }>
                        <AiOutlinePlus />
                    </span>
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

                    <div className={styles.footer}>
                        <Button size={'lg'} onClick={() => setIsOpen3(true)}>Thoát</Button>
                        <Button type="submit" primary size={'lg'}>Tạo nhóm</Button>
                    </div>
                </form>
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