import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // No token → login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let user = null;

    try {
        user = userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    // If route requires a role
    if (allowedRoles && allowedRoles.length > 0) {

        if (!user || !user.role) {
            return <Navigate to="/dashboard" replace />;
        }

        const userRole = user.role.toUpperCase();

        const hasPermission = allowedRoles.some(
            (role) => role.toUpperCase() === userRole
        );

        if (!hasPermission) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;