import React, { useState } from 'react'
import {AiFillPushpin} from "react-icons/ai";
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Alert from '../Common/Alert/Alert'
import Model from '../Common/Model/Model'

const OptionNotify = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAlert, setIsAlert] = useState(false) 

    // Prev form not save
    const prevQuit = (chose) => {
        if (chose) {
            setIsOpen(false)
        } 
        setIsAlert(false)
    }


    return (
      <>
          <span title='Thông báo' onClick={() => setIsOpen(true)}>
            <AiFillPushpin />
          </span>

          <Model 
              isOpen={isOpen} 
              handleClick={() => setIsAlert(true)} 
              heading={'Thông báo'}
              prevLostData={() => setIsAlert(true)}
          >
              <div className={styles.footer}>
                      <Button 
                          type="submit" 
                          primary 
                          fluid
                          size={'lg'}
                      >
                          Lưu lại
                      </Button>
                  </div>
          </Model>
          <Alert 
              heading={'Cảnh báo'}
              text={'Bạn chưa lưu lại dữ liệu, bạn có muốn rời đi không'}
              isOpen={isAlert} 
              userComfirm={prevQuit} 
          />
      </>
    )
}

export default OptionNotify