import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axios/axiosinstance';

function RestrictedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const navigate = useNavigate();

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
        }
        return false;
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
        (async () => {
            const isValid = await validateAccessToken();
            setIsAuthorized(isValid);
        })();
    }, [validateAccessToken]);

    useEffect(() => {
        if (isAuthorized) navigate('/profile');
    }, [isAuthorized, navigate]);

    if (isAuthorized === null) return <div>Loading...</div>;

    return !isAuthorized ? children : null;
}

export default RestrictedRoute;
