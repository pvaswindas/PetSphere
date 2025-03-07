import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import WebSocketService from '../services/WebSocketService';

function WebSocketInitializer() {
  const isLoggedIn = useSelector(state => !!state.profile.profile_data);

  useEffect(() => {
    if (isLoggedIn) {
      // Initialize the WebSocket connection when user is logged in
      WebSocketService.connect();
      
      // Clean up on component unmount
      return () => {
        // Don't disconnect completely - just clean up resources
        if (WebSocketService.pingInterval) {
          clearInterval(WebSocketService.pingInterval);
        }
      };
    }
  }, [isLoggedIn]);

  return null;
}

export default WebSocketInitializer;