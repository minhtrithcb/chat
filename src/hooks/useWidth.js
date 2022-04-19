import { useEffect, useState } from 'react'

const useWidth = (myRef) => {
    const [width, setWidth] = useState(0)
    useEffect(() => {
        const handleResize = () => {
          setWidth(myRef.current.offsetWidth)
        }
    
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [myRef])

    return width 
}

export default useWidth