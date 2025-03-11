import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axios/axiosinstance';

export function useAuth() {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (!refreshToken) return false;

        try {
            const res = await axiosInstance.post('accounts/token/refresh/', { refresh: refreshToken });
            localStorage.setItem('ACCESS_TOKEN', res.data.access);
            localStorage.setItem('REFRESH_TOKEN', res.data.refresh);
            setIsAuthorized(true);
            return true;
        } catch (error) {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            setIsAuthorized(false);
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
            return false;
        }
    }, [refreshAccessToken]);

    useEffect(() => {
        (async () => {
            const isValid = await validateAccessToken();
            setIsAuthorized(isValid);
            setIsLoading(false);
        })();
    }, [validateAccessToken]);

    return { isAuthorized, isLoading };
}