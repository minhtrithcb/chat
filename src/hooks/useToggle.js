import { useState } from 'react'

const useToggle = (defaultValue) => {

    const [toggle, setToggle] = useState(defaultValue)

    function toggleF(value) {
        setToggle(prevValue => typeof value === "boolean" ? value : !prevValue  )
    }

    return [toggle, toggleF]
}

export default useToggle