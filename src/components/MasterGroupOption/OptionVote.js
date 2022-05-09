import React, { useState } from 'react'
import {MdOutlinePlaylistAddCheck} from "react-icons/md";
import Button from '../Common/Button/Button'
import styles from './MasterGroupOption.module.scss'
import Model from '../Common/Model/Model'

const OptionVote = () => {
    const [isOpen, setIsOpen] = useState(false)


    return (
      <>
          <span title='Thêm bình chọn' onClick={() => setIsOpen(true)}>
            <MdOutlinePlaylistAddCheck />
          </span>

          <Model 
              isOpen={isOpen} 
              handleClick={setIsOpen} 
              heading={'Thêm bình chọn'}
              prevLostData={() => setIsOpen(true)}
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
      </>
    )
}

export default OptionVote