import jwtDecode from 'jwt-decode'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import friendReqApi from '../api/friendReqApi'

export const FriendContext = createContext()

const FriendProvider = ({ children }) => {
	const { auth } = useContext(AuthContext)
	const [frLength, setFrLength] = useState(0)
	const [friendList, setFriendList] = useState([])

	// Fetch all FR when current user have Someone sent a Fr
	useEffect(() => {
		const getFriendReqs = async () => {
			if (auth.accessToken) {
				let currentUser = jwtDecode(auth.accessToken)
				const { data } = await friendReqApi.getAcceptFriendReq(
					currentUser.id
				)
				setFrLength(data.length)
			}
		}
		getFriendReqs()
	}, [auth])

	return (
		<FriendContext.Provider
			value={{ frLength, setFrLength, friendList, setFriendList }}
		>
			{children}
		</FriendContext.Provider>
	)
}

export default FriendProvider
