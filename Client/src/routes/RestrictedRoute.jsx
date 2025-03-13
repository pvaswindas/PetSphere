import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingPage from '../pages/LoadingPage';

function RestrictedRoute({ children }) {
    const { isAuthorized, isLoading } = useAuth();

    if (isLoading) return <LoadingPage />;
    
    return isAuthorized ? <Navigate to="/feed" replace /> : children;
}

export default RestrictedRoute;
