import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
const AdminProtected = () => {
    const { loading, user } = useContext(AuthContext)
    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default AdminProtected