import axiosInstance from '../axios/axiosinstance';
import { jwtDecode } from 'jwt-decode';

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');
    if (!refreshToken) return false;

    try {
        const res = await axiosInstance.post('accounts/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('ACCESS_TOKEN', res.data.access);
        localStorage.setItem('REFRESH_TOKEN', res.data.refresh);
        return true;
    } catch (error) {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        return false;
    }
};

export const validateAccessToken = async () => {
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
};
