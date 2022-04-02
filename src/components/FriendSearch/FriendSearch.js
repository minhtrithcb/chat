import React, { useState } from 'react'
import styles from './FriendSearch.module.scss'
import removeAccents from '../../helper/removeAccents'

const FriendSearch = ({data, setData}) => {
    const [input, setInput] = useState("")
    const [clone, setClone] = useState([])

    const handleChage = (e) => {
        const searchValue = e.target.value.trim()
        const query = removeAccents(searchValue.toLowerCase())
        setInput(searchValue)
        setClone(data)
        if (searchValue.length >= 3 && searchValue !== "" ) {
            const newResult = data.filter(vl => {
                return removeAccents(vl.fullname.toLowerCase()).includes(query)
            })
            setData(newResult)
        } else {
            setData(clone)
        }
    }

    return (
        <div>
            <div className={styles.inputSearch}>
                <input type="text" placeholder='Tìm kiếm bạn bè ...'
                    value={input}
                    onChange={handleChage} 
                />
            </div>
        </div>
    )
}

export default FriendSearch