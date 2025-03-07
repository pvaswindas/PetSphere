import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerUp, setIsServerUp] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    // Check if the server is up
    const checkServerStatus = async () => {
        try {
        await axios.get(`${process.env.REACT_APP_API_BASE_URL}/health-check/`);
        setIsServerUp(true);
        } catch (error) {
        setIsServerUp(false);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        // Handle online status changes
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial server check
        checkServerStatus();

        // Poll the server every minute to check its status
        const serverCheckInterval = setInterval(checkServerStatus, 60000);

        // Clean up event listeners and intervals
        return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(serverCheckInterval);
        };
    }, []);

    return { isOnline, isServerUp, isLoading };
};