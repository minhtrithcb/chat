import React, { useContext, useState } from 'react'
import {BsVolumeMute} from "react-icons/bs";
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Model from '../Common/Model/Model'
import { ChatContext } from '../../context/ChatContext';
import useDecodeJwt from '../../hooks/useDecodeJwt';
import { SocketContext } from '../../context/SocketContext';
import Avatar from '../Common/Avatar/Avatar';
import { Link } from 'react-router-dom';
import AlertInfo from '../Common/AlertInfo/AlertInfo';
import ChoseRadius from '../Common/ChoseRadius/ChoseRadius';
import Input from '../Common/Form/Input';
import Select from 'react-select'
import converApi from '../../api/converApi';
import chatApi from '../../api/chatApi';
import { toast } from 'react-toastify';
import moment from 'moment';

const OptionMute = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenReason, setIsOpenReason] = useState(false)
    const [reason, setReason] = useState(1) 
    const [otherReason, setOtherReason] = useState('') 
    const [memberSelect, setMemberSelect] = useState({})
    const {currentChat, setCurrentChat, friend} = useContext(ChatContext)
    const {socket} = useContext(SocketContext)
    const [currentUser] = useDecodeJwt()
    const [choseTime, setChoseTime] = useState({ value: '1d', label: 'Một ngày' })
    const options = [
        { value: '1d', label: 'Một ngày' },
        { value: '1w', label: 'Một tuần' },
        { value: '1m', label: 'Một tháng' },
        // { value: '20s', label: '20 giây (test)' }
    ]

    // Change option
    const handleChangeOption = (e) => {
        setChoseTime({value: e.value, title: e.label});
    }

    // Event ban user
    const handleSaved = async () => {
        // console.log(memberSelect, choseTime, reason, otherReason);
        const reasonBan = calcReason()
        const timeBan = calcTime()
        try {
            const {data} = await converApi.banUser({
                roomId: currentChat._id, 
                memberId: memberSelect._id, 
                reason: reasonBan, 
                time: timeBan
            })

            if (data?.success) {
                const deadLine = moment(timeBan).format('DD/MM/YYYY')
                // send msg to room
                const res = await chatApi.postNewChat({
                    roomId: currentChat._id,
                    sender: currentUser.id,
                    text:   `${currentUser.username} đã cấm chat ${memberSelect.fullname} đến ngày ${deadLine}`,
                    type: "Notify"
                })
                // Send to socket room
                socket.emit("send-msg", res.data)
                // Send to socket id
                socket.emit("sendToFriendOnline", { 
                    recivers : friend, 
                    ...res.data
                })
                // send to user band
                socket.emit("send-muteUser", { 
                    recivers: [memberSelect], 
                    roomId: currentChat._id
                })
                resetInput()
                setCurrentChat(data?.result)
                toast.success('Cấm chat thành công')
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Calc reason ban by number 
    const calcReason = () => {
        switch (reason) {
            case 1:
                return 'Vi phạm nội quy, quy tắc nhóm !'
            case 2:
                return 'Người dùng spam, có hành vi lừu đảo.'
            case 3:
                return otherReason || 'Lý do khác'
        
            default:
                return 'Vi phạm nội quy, quy tắc nhóm !'
        }
    }

    // Calc time ban  
    const calcTime = () => {
        switch (choseTime.value) {
            case '1d':
                return moment(Date.now()).add(1, 'days');
        
            case '1w':
                return moment(Date.now()).add(7, 'days');
        
            case '1m':
                return moment(Date.now()).add(30, 'days');
            
            // case '20s':
            //     return moment(Date.now()).add(20, 'second');
        
            default:
                return moment(Date.now()).add(1, 'days');
        }
    }

    // reset after close model reason
    const resetInput = () => {
        setReason(1)
        setChoseTime({ value: '1d', label: 'Một ngày' })
        setOtherReason('')
        setIsOpenReason(false)
    }

    // Find ban user
    const findBanUser = (userId) => {
        return currentChat?.membersBanned.find(ban => ban._id === userId) 
    }

    // Unban user
    const handleUnBan = async (user) => {
        const {data} = await converApi.unBanUser({
            roomId: currentChat._id, 
            memberId: user._id
        })
        if (data?.success) {
            toast.success("Gở cấm chat thành công")
            setCurrentChat(data?.result)
            socket.emit("send-unMute", { 
                recivers: [user], 
                roomId: currentChat._id,
                result: data?.result
            })
        }
    }
    return (
      <>
          <span title='Cấm chat' onClick={() => setIsOpen(true)}>
            <BsVolumeMute />
          </span>
          {/* Model members */}
          <Model 
              isOpen={isOpen} 
              handleClick={setIsOpen} 
              heading={'Cấm chat thành viên'}
              prevLostData={() => setIsOpen(true)}
          >
                <AlertInfo text={'Chọn để cấm chat người dùng này. Người dùng bị cấm chat sẻ không thể xem chat cho đến khi được gở hoặc hết thời gian hiệu lực !'}  />
                {currentChat && currentChat.members.filter(u => u._id !== currentUser.id).map(u => (
                        <div key={u._id} className={styles.userItem}>
                        <Avatar size={'sm'} letter={u.fullname.charAt(0)} />
                        <span>
                            <Link to={`/profile/${u._id}`}>{u.fullname}</Link>    
                            <small>{u.email}</small>
                        </span>

                        { findBanUser(u._id) ? 
                        <Button type="Button" onClick={() => handleUnBan(u)}>
                            Mở cấm chat {moment(findBanUser(u._id).time).format('DD/MM/YYYY')}
                        </Button>: 
                        <Button danger type="Button" onClick={() => {
                            setIsOpenReason(true)
                            setMemberSelect(u)
                        }}>Cấm chat</Button> }
                    </div>
                ))}
          </Model>
          {/* Model reason */}
          <Model 
              isOpen={isOpenReason} 
              handleClick={setIsOpenReason} 
              heading={'Xác nhận lí do'}
              prevLostData={resetInput}
          >
              <AlertInfo text={`Bạn đang chọn: ${memberSelect.fullname}`} />
                <div className={styles.dflex}>
                    <ChoseRadius 
                        text="Vi phạm nội quy, quy tắc nhóm !"
                        title={"Lý do 1"}
                        active={reason === 1}
                        onClick={() => setReason(1)}
                    />
                    <ChoseRadius 
                        text="Người dùng spam, có hành vi lừu đảo."
                        title={"Lý do 2"}
                        active={reason === 2}
                        onClick={() => setReason(2)}
                    />
                    <ChoseRadius 
                        text="Lý do khác ..."
                        title={"Lý do 3"}
                        active={reason === 3}
                        onClick={() => setReason(3)}
                    />
                </div>
               {reason === 3 && 
                <Input 
                    type="text" 
                    label="Lý do khác" 
                    placeholder="Nhập lý do khác" 
                    ctStyle={{padding: "0.7em"}} 
                    onChange={e => setOtherReason(e.target.value)}
                />}
               <label>Thời gian cấm</label>
               <Select  
                    options={options} 
                    onChange={handleChangeOption}
                    defaultValue={options[0]} 
                />
               <div className={styles.footer}>
                    <Button 
                        type="submit" 
                        primary 
                        fluid
                        size={'lg'}
                        onClick={handleSaved}
                    >
                        Lưu lại
                    </Button>
                </div>
          </Model>
      </>
    )
}

export default OptionMute