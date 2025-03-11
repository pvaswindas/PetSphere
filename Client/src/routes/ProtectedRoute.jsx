import { jwtDecode } from 'jwt-decode';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../pages/LoadingPage';
import { refreshAccessToken } from '../api/authApi';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const navigate = useNavigate();

    const auth = useCallback(async () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            const refreshed = await refreshAccessToken();
            setIsAuthorized(refreshed);
        } else {
            setIsAuthorized(true);
        }
    }, []);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, [auth]);

    useEffect(() => {
        if (isAuthorized === null) return;
        if (!isAuthorized) {
            navigate('/');
        }
    }, [isAuthorized, navigate]);

    if (isAuthorized === null) {
        return <LoadingPage />;
    }

    return isAuthorized ? children : null;
}

export default ProtectedRoute;