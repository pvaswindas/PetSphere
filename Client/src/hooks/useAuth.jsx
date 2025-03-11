import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axios/axiosinstance';
import { useLogout } from './useLogout';

export function useAuth() {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userStatus, setUserStatus] = useState(null);
    const logout = useLogout()

    const checkUserStatus = useCallback(async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return false;

        try {
            const response = await axiosInstance.get('accounts/user/status/');
            if (response.data.status === 'suspended') {
                // Handle suspension
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                await logout()
                setIsAuthorized(false);
                setUserStatus('suspended');
                return false;
            }
            setUserStatus('active');
            return true;
        } catch (error) {
            return false;
        }
    }, [logout]);

    const refreshAccessToken = useCallback(async () => {
        // Existing refresh logic
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (!refreshToken) return false;

        try {
            const res = await axiosInstance.post('accounts/token/refresh/', { refresh: refreshToken });
            localStorage.setItem('ACCESS_TOKEN', res.data.access);
            localStorage.setItem('REFRESH_TOKEN', res.data.refresh);
            
            // Add status check after successful refresh
            const statusOk = await checkUserStatus();
            setIsAuthorized(statusOk);
            return statusOk;
        } catch (error) {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            setIsAuthorized(false);
            return false;
        }
    }, [checkUserStatus]);

    const validateAccessToken = useCallback(async () => {
        // Existing validation logic with added status check
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                return await refreshAccessToken();
            }
            // Even if token is valid, check user status
            return await checkUserStatus();
        } catch (error) {
            return false;
        }
    }, [refreshAccessToken, checkUserStatus]);

    useEffect(() => {
        (async () => {
            const isValid = await validateAccessToken();
            setIsAuthorized(isValid);
            setIsLoading(false);
        })();

        // Set up periodic checks (every 5 minutes)
        const intervalId = setInterval(async () => {
            await checkUserStatus();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [validateAccessToken, checkUserStatus]);

    return { isAuthorized, isLoading, userStatus };
}