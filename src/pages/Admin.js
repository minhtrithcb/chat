import { useEffect } from "react"
import { useParams } from "react-router-dom"

const Admin = () => {
    const {code} = useParams()
    
    useEffect(() => {
      console.log(code);  
    }, [code])
    
    return (
        <div>
          shit
      </div>
    )
}

export default Admin