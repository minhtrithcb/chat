import React, { useContext, useState } from 'react'
import { AiOutlineUserDelete } from 'react-icons/ai'
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Alert from '../Common/Alert/Alert'
import Model from '../Common/Model/Model'
import { ChatContext } from '../../context/ChatContext'
import Avatar from '../Common/Avatar/Avatar'
import { Link } from 'react-router-dom'
import converApi from '../../api/converApi'
import { toast } from 'react-toastify'
import { SocketContext } from '../../context/SocketContext'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import chatApi from '../../api/chatApi'
import AlertInfo from '../Common/AlertInfo/AlertInfo'
import useLoading from '../../hooks/useLoading'

const OptionDelete = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isAlert, setIsAlert] = useState(false)
	const [memberSelect, setMemberSelect] = useState({})
	const { currentChat, setCurrentChat, friend } = useContext(ChatContext)
	const { socket } = useContext(SocketContext)
	const [currentUser] = useDecodeJwt()
	const [loading, setLoading, Icon] = useLoading()

	// Prev form not save
	const comfirmDelete = async (chose) => {
		if (chose) {
			setLoading(true)
			// post msg
			const { data } = await chatApi.postNewChat({
				roomId: currentChat._id,
				sender: memberSelect._id,
				text: `${currentUser.username} đã mời ${memberSelect.fullname} rời khỏi nhóm`,
				type: 'Notify',
			})
			// Send to socket room
			socket.emit('send-msg', data)
			// Send to socket id
			socket.emit('sendToFriendOnline', {
				recivers: friend,
				...data,
			})
			// leave group
			const res = await converApi.leaveGroup(
				memberSelect._id,
				currentChat._id
			)

			if (res.data?.success) {
				setLoading(false)
				socket.emit('send-deleteGroup', {
					recivers: [memberSelect],
					roomId: currentChat._id,
					sender: memberSelect.id,
				})
				toast.success('Đã mời người dùng ra khỏi nhóm')
				setIsAlert(false)
				setCurrentChat(res.data.result)
			}
		}
		setIsAlert(false)
	}

	return (
		<>
			<span title='Đuổi khỏi nhóm' onClick={() => setIsOpen(true)}>
				<AiOutlineUserDelete />
			</span>

			<Model
				isOpen={isOpen}
				handleClick={setIsOpen}
				heading={'Xóa thành viên'}
				prevLostData={() => setIsAlert(false)}
			>
				<AlertInfo text='Chọn để xóa người dùng này ra khỏi nhóm !' />
				{currentChat &&
					currentChat.members
						.filter((u) => u._id !== currentUser.id)
						.map((u) => (
							<div key={u._id} className={styles.userItem}>
								<Avatar
									size={'sm'}
									letter={u.fullname.charAt(0)}
								/>
								<span>
									<Link to={`/profile/${u._id}`}>
										{u.fullname}
									</Link>
									<small>{u.email}</small>
								</span>
								<Button
									danger
									type='Button'
									disabled={loading}
									onClick={() => {
										setIsAlert(true)
										setMemberSelect(u)
									}}
								>
									{loading && memberSelect?._id === u._id ? (
										<>
											Đang xóa <Icon />
										</>
									) : (
										'Xóa thành viên'
									)}
								</Button>
							</div>
						))}
			</Model>
			<Alert
				heading={'Cảnh báo'}
				text={'Bạn có muốn xóa người này nhóm ?'}
				isOpen={isAlert}
				userComfirm={comfirmDelete}
			/>
		</>
	)
}

export default OptionDelete
