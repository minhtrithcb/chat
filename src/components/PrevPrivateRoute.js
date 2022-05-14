import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrevPrivateRoute = () => {
    const {auth} = useContext(AuthContext)
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    if (!auth.isLogin) {
        return <Outlet />;
    }

    if(auth.isLogin) {
        return <Navigate to={from} replace />;
    }
}

export default PrevPrivateRoute