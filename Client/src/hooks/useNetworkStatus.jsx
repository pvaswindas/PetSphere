import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerUp, setIsServerUp] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    // Check if the server is up with retry logic
    const checkServerStatus = useCallback(async (isRecoveryAttempt = false) => {
        if (!navigator.onLine) {
            setIsServerUp(false);
            setIsLoading(false);
            return;
        }

        try {
            await axios.get(`${process.env.REACT_APP_API_BASE_URL}health-check/`, {
                timeout: 5000, // 5 second timeout
            });
            setIsServerUp(true);
            setRetryCount(0); // Reset retry count on success
            setIsLoading(false);
        } catch (error) {
            // If we're recovering from offline, retry more aggressively
            if (isRecoveryAttempt && retryCount < 3) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => checkServerStatus(true), 2000); // Retry after 2 seconds
                return;
            }
            
            setIsServerUp(false);
            setIsLoading(false);
        }
    }, [retryCount]);

    // Handle transition back to online
    const handleOnline = useCallback(() => {
        setIsOnline(true);
        setIsLoading(true); // Show loading state during recovery
        setRetryCount(0);
        // Give network a moment to stabilize, then try with recovery mode
        setTimeout(() => checkServerStatus(true), 2000);
    }, [checkServerStatus]);

    const handleOffline = () => {
        setIsOnline(false);
        setIsServerUp(false);
        setIsLoading(false);
    };

    useEffect(() => {
        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial server check
        checkServerStatus();

        // Poll the server every minute to check its status
        const serverCheckInterval = setInterval(() => checkServerStatus(), 60000);

        // Clean up event listeners and intervals
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(serverCheckInterval);
        };
    }, [checkServerStatus, handleOnline]);

    const status = useMemo(() => ({ 
        isOnline, 
        isServerUp, 
        isLoading 
      }), [isOnline, isServerUp, isLoading]);
      
    return status;
};