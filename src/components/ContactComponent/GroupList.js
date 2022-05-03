import React, { useContext, useEffect, useState } from 'react'
import styles from './ContactComponent.module.scss'
import useDecodeJwt from '../../hooks/useDecodeJwt'
import converApi from '../../api/converApi'
import Button from '../Common/Button/Button'
import { BsChatSquareDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Dropdown, { DropdownItem } from '../Common/Dropdown/Dropdown'
import useTheme from '../../hooks/useTheme'
import clsx from 'clsx'
import { ChatContext } from '../../context/ChatContext';
import GroupCardItem from './GroupCardItem'
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import Model from '../Common/Model/Model'
import GroupInfoTab from '../GroupInfoTab/GroupInfoTab'

const GroupList = () => {
    const [currentUser] = useDecodeJwt()
    const [groupList, setGroupList] = useState([])
    const [isOpenGroupDetail, setIsOpenGroupDetail] = useState(false)
    const {setFriend, setCurrentChat, setChatsOption} = useContext(ChatContext)
    const {theme} = useTheme()
    const navigate = useNavigate();
    const classesDarkMode = clsx(styles.cardContainer,{ 
      [styles.dark]: theme === "dark"
    })

    // Fetch all Group by user id
    useEffect(() => {
      let isMounted = true;

      const getGroupList = async () => {
        const {data} = await converApi.getByUserId({
            userId: currentUser.id,
            type: "Group"
        })
        if (isMounted) 
            setGroupList(data)
      }

      getGroupList()
      return () => { isMounted = false };
    }, [currentUser.id])

    // // Redirect to chat Group
    const handleRedirectChat = async (group) => {
      const friends = group.members.filter(u => u._id !== currentUser.id)
      setFriend(friends);
      setChatsOption({type: 'Group', title: "Tin nhắn nhóm"})
      setCurrentChat(group)
      navigate('/', {replace: true})
    }

    const handleChoseGroup = (group) => {
      const friends = group.members.filter(u => u._id !== currentUser.id)
      setFriend(friends);
      setCurrentChat(group)
      setIsOpenGroupDetail(true)
    }

    return (
      <div className={classesDarkMode}>
          {groupList.length !== 0 ? groupList.map(gr => (
            <GroupCardItem group={gr} key={gr._id} >
                <div key={'topLeft'}>
                        {gr.private ? 
                        <AiOutlineLock style={{color: '#ff7675'}} />  :                  
                        <AiOutlineUnlock style={{color: '#2ecc71'}} />}
                </div>
                <Dropdown position="right" key="topRight" >
                    <DropdownItem
                      onClick={() => handleChoseGroup(gr) }  
                    >
                        Chi tiết
                    </DropdownItem>
                </Dropdown>
                <Button fluid key="botRight" primary
                  onClick={() => handleRedirectChat(gr)}
                >
                    <span>Nhắn tin</span>  <BsChatSquareDots />
                </Button>
            </GroupCardItem>
          ))
          :<p>Hãy Tham gia nhóm nhiều hơn nào !</p> }

          <Model isOpen={isOpenGroupDetail} heading={"Chi tiết Nhóm"} handleClick={setIsOpenGroupDetail}>
              <GroupInfoTab />
          </Model>
      </div>
    )
}

export default GroupList