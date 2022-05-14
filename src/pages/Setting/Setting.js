import clsx from 'clsx'
import React, { useState } from 'react'
import useTheme from '../../hooks/useTheme'
import styles from './Setting.module.scss'
import Dropdown, {DropdownItem}  from '../../components/Common/Dropdown/Dropdown'
import Button from '../../components/Common/Button/Button'
import Model from '../../components/Common/Model/Model'
import { IoIosArrowDown } from "react-icons/io";
import SettingChagePass from './SettingChagePass'
import Alert from '../../components/Common/Alert/Alert'

const Setting = () => {
    const {theme, toggle, themeConver, setThemeConver} = useTheme()
    const classesDarkMode = clsx(styles.settingContainer,{ 
      [styles.dark]: theme === "dark"
    })

    const classTheme = clsx(styles.settingSwitch, {
      [styles.checker] : theme === 'dark',
      [styles.unChecked] : theme === 'light',
    })

    const [isOpen, setIsOpen] = useState(false)
    const [isAlert, setIsAlert] = useState(false) 

    // User change theme converstaion
    const changeThemeConver = () => {
      setThemeConver(prev => prev === "default" ? "simple" : "default");
    }

    // Prev form not save
    const prevQuit = (chose) => {
      if (chose) {
          setIsOpen(false)
      } 
      setIsAlert(false)
    }

    return (
      <div className={classesDarkMode}>
        <div className={styles.settingHeading}>
          <h3>Cài đặt</h3>
        </div>

        <div className={styles.settingMain}>
          {/* Password  */}
          <h4>Cài đặt bảo mật</h4>
          <div className={styles.settingCard}>
            <div className={styles.settingCardItem}>
              <p>Bảo mật hai lớp</p>
              <Button>Thiết lập</Button>
            </div>
            <div className={styles.settingCardItem}>
              <p>Đổi mật khẩu</p>
              <Button onClick={()=> setIsOpen(true)}>Thiết lập</Button>
            </div>
          </div>

          <Model 
              heading={"Đổi mật khẩu"}
              isOpen={isOpen} 
              handleClick={() => setIsAlert(true)}
              prevLostData={() => setIsAlert(true)}
          >
              {/* <SettingChagePass onSubmited={isSubmit =>   {
                if (isSubmit) prevQuit(true)
              }} /> */}
          </Model>

          {/* Privacy  */}
          <h4>Cài đặt quyển riêng tư</h4>
          <div className={styles.settingCard}>
            <div className={styles.settingCardItem}>
              <p>Ai có thể tìm kiếm tên của bạn ?</p>
              <div className={styles.labelDiv}>
              <small>Bất kì ai</small>
                <Dropdown icon={IoIosArrowDown}>
                    <DropdownItem >Bất kì ai</DropdownItem>
                    <DropdownItem >Không một ai</DropdownItem>
                </Dropdown>
              </div>
            </div>
            <div className={styles.settingCardItem}>
              <p>Ai có thể xem thông tin cá nhân của bạn ?</p>
              <div className={styles.labelDiv}>
              <small>Bất kì ai</small>
                <Dropdown icon={IoIosArrowDown}>
                    <DropdownItem >Bất kì ai</DropdownItem>
                    <DropdownItem >Không một ai</DropdownItem>
                </Dropdown>
              </div>
            </div>
            <div className={styles.settingCardItem}>
              <p>Ai có thể mời bạn vào nhóm ?</p>
              <div className={styles.labelDiv}>
                <small>Bạn bè</small>
                <Dropdown icon={IoIosArrowDown}>
                    <DropdownItem >Bạn bè</DropdownItem>
                    <DropdownItem >Không một ai</DropdownItem>
                </Dropdown>
              </div>
            </div>

          </div>
          {/* // Theme  */}
          <h4>Cài đặt giao diện</h4>
          <div className={styles.settingCard}>
            <div className={styles.settingCardItem}>
              <p>Giao diện ứng dụng</p>
              <div className={styles.labelDiv}>
                <small>{theme === 'dark' ? "Màu tối" : "Màu sáng"}</small>
                <input type="checkbox" 
                  onClick={toggle} 
                  className={classTheme} 
                  defaultChecked={theme === "dark"}  
                />
              </div>
            </div>
            <div className={styles.settingCardItem}>
              <p>Giao diện cuộc hội thoại</p>
              <div className={styles.labelDiv}>
                <small>{themeConver === 'simple' ? "Đơn giản" : "Mặc định"}</small>
                <input 
                  type="checkbox" 
                  className={styles.settingSwitch}
                  onClick={changeThemeConver}
                  defaultChecked={themeConver === 'simple' }
                />
              </div>
            </div>
          </div>

          <Alert 
                heading={'Cảnh báo'}
                text={'Bạn chưa lưu lại dữ liệu, bạn có muốn rời đi không'}
                isOpen={isAlert} 
                userComfirm={prevQuit} 
            />
        </div>
      </div>
    )
}

export default Setting