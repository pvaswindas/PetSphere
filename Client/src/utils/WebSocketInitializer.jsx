import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import websocketService from '../services/websocketService';

function WebSocketInitializer() {
  const isLoggedIn = useSelector(state => !!state.profile.profile_data);

  useEffect(() => {
    if (isLoggedIn) {
      // Initialize the WebSocket connection when user is logged in
      websocketService.connect();
      
      // Clean up on component unmount
      return () => {
        // Don't disconnect completely - just clean up resources
        if (websocketService.pingInterval) {
          clearInterval(websocketService.pingInterval);
        }
      };
    }
  }, [isLoggedIn]);

  return null;
}

export default WebSocketInitializer;