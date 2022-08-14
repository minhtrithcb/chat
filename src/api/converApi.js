import api from './api.config'

const converApi = {
	getByUserId({ userId, type }) {
		return api.get(`conversation/get`, {
			params: {
				userId,
				type,
			},
		})
	},
	getCountUnReadMsg(userId) {
		return api.get(`conversation/getCountUnReadMsg/${userId}`)
	},
	getOneByUserId(currentUserId, friendId) {
		return api.post(`conversation/getOne`, {
			currentUserId,
			friendId,
		})
	},
	postUnReadMsg({ roomId, senderId, recivers }) {
		return api.post(`conversation/postUnReadMsg`, {
			roomId,
			senderId,
			recivers,
		})
	},
	postReadMsg({ roomId, currentUserId }) {
		return api.post(`conversation/postReadMsg`, {
			roomId,
			currentUserId,
		})
	},
	createFriendConver(senderId, receiverId) {
		return api.post(`conversation/postFriend`, {
			senderId,
			receiverId,
		})
	},
	createGroptConver({ members, owner, nameGroup, privacy, des, rule }) {
		return api.post(`conversation/postGroup`, {
			members,
			owner,
			nameGroup,
			des,
			privacy,
			rule,
		})
	},
	editGroupConver({ roomId, name, des, rule, privacy }) {
		return api.post(`conversation/edit-group`, {
			roomId,
			name,
			des,
			rule,
			privacy,
		})
	},
	deleteByFriendId(currentUserId, friendId) {
		return api.post(`conversation/delete`, { currentUserId, friendId })
	},
	leaveGroup(currentUserId, roomId) {
		return api.post(`conversation/leave-group`, { currentUserId, roomId })
	},
	deleteGroup(currentUserId, roomId) {
		return api.post(`conversation/delete-group`, { currentUserId, roomId })
	},
	banUser({ roomId, memberId, reason, time }) {
		return api.post(`conversation/ban-user`, {
			roomId,
			memberId,
			reason,
			time,
		})
	},
	unBanUser({ roomId, memberId }) {
		return api.post(`conversation/unBan-user`, { roomId, memberId })
	},
	addFriendIntoGroup({ roomId, friendId }) {
		return api.post(`conversation/add-user`, { roomId, friendId })
	},
	getLastMessage(converId) {
		return api.get(`conversation/lastMsg/${converId}`)
	},
}

export default converApi
