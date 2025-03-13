import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import LoadingPage from '../pages/LoadingPage';

function AdminOnlyRoute({ children }) {
    const { isAuthorized, isLoading } = useAuth();
    const navigate = useNavigate();
    const admin = useSelector((state) => state.profile.profile_data);

    if (isLoading) return <LoadingPage />;

    if (!isAuthorized || !admin?.user?.is_staff) {
        navigate('/admin/login');
        return null;
    }

    return children;
}

export default AdminOnlyRoute;
