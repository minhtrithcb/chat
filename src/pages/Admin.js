import jwtDecode from 'jwt-decode'
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Admin = () => {
  const {auth} = useContext(AuthContext)
  let a = jwtDecode(auth.accessToken)

  console.log(a);

  return (
    <div></div>
  )
}

export default Admin