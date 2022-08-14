import React, { useContext, useEffect, useState } from 'react'
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Model from '../Common/Model/Model'
import { ChatContext } from '../../context/ChatContext'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import { SocketContext } from '../../context/SocketContext'
import Avatar from '../Common/Avatar/Avatar'
import { Link } from 'react-router-dom'
import AlertInfo from '../Common/AlertInfo/AlertInfo'
import converApi from '../../api/converApi'
import chatApi from '../../api/chatApi'
import { toast } from 'react-toastify'
import useLoading from '../../hooks/useLoading'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { FriendContext } from '../../context/FriendContext'
import userApi from '../../api/userApi'

const OptionAdd = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [memberSelect, setMemberSelect] = useState({})
	const { currentChat, setCurrentChat, friend } = useContext(ChatContext)
	const { friendList, setFriendList } = useContext(FriendContext)
	const { socket } = useContext(SocketContext)
	const [currentUser] = useDecodeJwt()
	const [loading, setLoading, Icon] = useLoading()

	// Fetch friendList & sender user obj
	useEffect(() => {
		let isMounted = true
		const getFriendList = async () => {
			if (isOpen === true) {
				const { data } = await userApi.getFriendUser(currentUser.id)
				if (isMounted) setFriendList(data)
			}
		}

		getFriendList()
		return () => {
			isMounted = false
		}
	}, [currentUser.id, setFriendList, isOpen])

	// Add friend to group
	const handleAddFriendIntoGroup = async (choseFriend) => {
		try {
			setLoading(true)

			// post msg
			const { data } = await chatApi.postNewChat({
				roomId: currentChat._id,
				sender: currentUser.id,
				text: `${currentUser.username} đã thêm ${choseFriend.fullname} vào nhóm`,
				type: 'Notify',
			})

			// Send to socket room
			socket.emit('send-msg', data)
			// Send to socket id
			socket.emit('sendToFriendOnline', {
				recivers: friend,
				...data,
			})

			// Sent to refresh group
			socket.emit('send-createGroup', {
				recivers: [choseFriend],
				sender: currentUser.id,
				group: currentChat._id,
			})
			// Add friend into group
			const res = await converApi.addFriendIntoGroup({
				roomId: currentChat._id,
				friendId: choseFriend._id,
			})

			if (res.data?.success) {
				setLoading(false)
				setIsOpen(false)
				toast.success('Đã mời người dùng thành công')
				setCurrentChat(res.data.result)
			}
		} catch (error) {
			toast.error(`Đã có lỗi xãy ra : ${error}`)
		}
	}

	// Check if user already in group
	const isIntoGroup = (friendId) => {
		const found = currentChat.members.findIndex((u) => u._id === friendId)
		return found !== -1
	}

	return (
		<>
			<span title='Thêm thành viên' onClick={() => setIsOpen(true)}>
				<AiOutlineUserAdd />
			</span>
			{/* Model members */}
			<Model
				isOpen={isOpen}
				handleClick={setIsOpen}
				heading={'Thêm thành viên'}
				prevLostData={() => setIsOpen(true)}
			>
				<AlertInfo
					text={`Chọn để thêm người dùng này vào nhóm. Danh sách thêm hiện chỉ giới hạn ở danh sách bạn bè !`}
				/>
				{friendList &&
					friendList.map((f) => (
						<div key={f._id} className={styles.userItem}>
							<div className={styles.avatar}>
								<Avatar
									size={'sm'}
									letter={f.fullname.charAt(0)}
								/>
							</div>
							<span>
								<Link to={`/profile/${f._id}`}>
									{f.fullname}
								</Link>
								<small>{f.email}</small>
							</span>
							{isIntoGroup(f._id) ? (
								<Button type='Button' disable='true'>
									Đã trong nhóm
								</Button>
							) : (
								<Button
									primary
									disabled={loading}
									onClick={() => {
										setMemberSelect(f)
										handleAddFriendIntoGroup(f) // here
									}}
									type='Button'
								>
									{loading && memberSelect._id === f._id ? (
										<>
											Đang thêm <Icon />
										</>
									) : (
										'Thêm thành viên'
									)}
								</Button>
							)}
						</div>
					))}
			</Model>
		</>
	)
}

export default OptionAdd
