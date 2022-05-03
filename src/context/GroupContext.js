import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import groupReqApi from '../api/groupReq';

export const GroupContext = createContext();

const GroupProvider = ({children}) => {
    const {auth} = useContext(AuthContext)
    const [grLength, setGrLength] = useState(0)
    const [groupList, setGroupList] = useState([])
    // Fetch all GR when current user have Someone sent a GR
    useEffect(() => {
        const getGroupReqs = async () => {
            if (auth.accessToken) {
                let currentUser = jwtDecode(auth.accessToken) 
                const {data} = await groupReqApi.getAcceptGroupReq(currentUser.id)
                setGrLength(data.length)
            }
        }
        getGroupReqs()
    }, [auth])

    return (
        <GroupContext.Provider value={{grLength, setGrLength, groupList, setGroupList}}>
            {children}
        </GroupContext.Provider>
    )
}

export default GroupProvider