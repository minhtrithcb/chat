import React, { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
    const location = useLocation();
    const {auth} = useContext(AuthContext)
    // console.log('private route');

    if (auth.isLogin) {
        return <Outlet />;
    }

    if(!auth.isLogin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

}

export default PrivateRoute