import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axios/axiosinstance';
import { useSelector } from 'react-redux';

function AdminOnlyRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const navigate = useNavigate();
    const admin = useSelector((state) => state.profile.profile_data);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (!refreshToken) return false;

        try {
            const res = await axiosInstance.post('accounts/token/refresh/', { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem('ACCESS_TOKEN', res.data.access);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }, []);

    const validateAccessToken = useCallback(async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                return await refreshAccessToken();
            }
            return true;
        } catch (error) {
            console.error('Token validation failed:', error);
        }
        return false;
    }, [refreshAccessToken]);

    useEffect(() => {
        const checkAuthorization = async () => {
            const isValid = await validateAccessToken();
            if (isValid && admin?.user?.is_staff) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                navigate('/admin/login');
            }
        };
        checkAuthorization();
    }, [validateAccessToken, admin, navigate]);

    if (isAuthorized === null) return <div>Loading...</div>;

    return isAuthorized ? children : null;
}

export default AdminOnlyRoute;
