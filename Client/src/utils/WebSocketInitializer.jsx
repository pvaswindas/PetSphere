import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import websocketServiceInstance from '../services/WebSocketService';

function WebSocketInitializer() {
  const isLoggedIn = useSelector(state => !!state.profile.profile_data);

  useEffect(() => {
    if (isLoggedIn) {
      // Initialize the WebSocket connection when user is logged in
      websocketServiceInstance.connect();
      
      // Clean up on component unmount
      return () => {
        // Don't disconnect completely - just clean up resources
        if (websocketServiceInstance.pingInterval) {
          clearInterval(websocketServiceInstance.pingInterval);
        }
      };
    }
  }, [isLoggedIn]);

  return null;
}

export default WebSocketInitializer;