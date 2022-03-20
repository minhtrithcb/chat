import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
    let location = useLocation();
    const {auth} = useContext(AuthContext)
    
    if (auth?.isLogin) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

}

export default PrivateRoute