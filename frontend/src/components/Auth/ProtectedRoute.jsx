import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // If user tries to access admin route, or admin tries to access user route (optional strictness)
        // For now, let's just redirect unauthorized roles to home or their respective dashboard
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
