import React, {  useContext, useState } from 'react'
import styles from './Contact.module.scss'
import FriendRequest from '../../components/ContactComponent/FriendRequest'
import ReciveFriendRequest from '../../components/ContactComponent/ReciveFriendRequest'
import FriendListContact from '../../components/ContactComponent/FriendListContact'
import { FriendContext } from '../../context/FriendContext'
import SearchBox from '../../components/SearchBox/SearchBox'
import clsx from 'clsx'
import useTheme from '../../hooks/useTheme'
import noSearch from '../../assets/images/illu/undraw_searching_re_3ra9.svg'
import Select from 'react-select';

const Contact = () => {
  const {theme} = useTheme()
  const [choseTabs, setchoseTabs] = useState(1)
  const {frLength} = useContext(FriendContext)

  const classesDarkMode = clsx(styles.contactContainer,{ 
    [styles.dark]: theme === "dark"
  })

  const options = [
    { value: 1, label: 'Danh sách bạn bè' },
    { value: 2, label: 'Danh sách chờ kết bạn' },
    { value: 3, label: 'Danh sách tin kết bạn' },
  ];

  const handleChange = (params) => {
    setchoseTabs(params.value)
  }

  return (
    <div className={classesDarkMode}>
      {/* left side  */}
      <div className={styles.sideBar}>
        <SearchBox />
        <img src={noSearch} alt="noSearch" />
        <p>Hãy tìm thêm bạn mới nào !</p>
      </div>
      {/* Right side  */}
      <div className={styles.contact}>
        <div className={styles.heading}>
          <h3>Liên hệ</h3>
        </div>
        <div className={styles.main}>

          <ul className={styles.tabs}>
            <li 
              className={choseTabs === 1 ? styles.active: null} 
              onClick={() => setchoseTabs(1)}>
                Danh sách bạn bè
            </li>
            <li 
              className={choseTabs === 2 ? styles.active: null} 
              onClick={() => setchoseTabs(2)}
            >
              Danh sách chờ kết bạn
            </li>
            <li 
              className={choseTabs === 3 ? styles.active: null} 
              onClick={() => setchoseTabs(3)}
              >
                Danh sách tin kết bạn
               {frLength > 0 ? <span>{frLength}</span> : null}
            </li>
          </ul>
          <Select
            defaultValue={options[0]}
            onChange={handleChange}
            options={options}
            className={styles.select}
          />

          {choseTabs === 1 && <FriendListContact />}
          {choseTabs === 2 && <FriendRequest />}
          {choseTabs === 3 && <ReciveFriendRequest />}
        </div>
      </div>
    </div>
  )
}

export default Contact