import React, { useState } from 'react'
import {MdOutlinePlaylistAddCheck} from "react-icons/md";
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Alert from '../Common/Alert/Alert'
import Model from '../Common/Model/Model'

const OptionVote = () => {
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
          <span title='Thêm bình chọn' onClick={() => setIsOpen(true)}>
            <MdOutlinePlaylistAddCheck />
          </span>

          <Model 
              isOpen={isOpen} 
              handleClick={() => setIsAlert(true)} 
              heading={'Thêm bình chọn'}
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

export default OptionVote