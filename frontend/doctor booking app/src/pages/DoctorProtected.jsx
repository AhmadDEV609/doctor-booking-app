import React from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
const DoctorProtected = () => {
    const { loading, user } = useContext(AuthContext)
    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== "doctor") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default DoctorProtected