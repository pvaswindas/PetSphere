// src/services/websocketService.js
let instance = null;

class WebSocketService {
  constructor() {
    if (instance) {
      return instance;
    }
    
    this.socket = null;
    this.callbacks = new Map();
    this.reconnectTimeout = null;
    this.pingInterval = null;
    this.isConnecting = false;
    
    instance = this;
    return instance;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }
    
    if (this.isConnecting) return;
    this.isConnecting = true;
    
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      this.isConnecting = false;
      return;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.socket = new WebSocket(`${wsProtocol}://${process.env.REACT_APP_API_SITE_URL}/ws/notifications/?token=${token}`);
    
    this.socket.onopen = () => {
      this.isConnecting = false;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Set up ping interval to keep connection alive
      this.startPingInterval();
      
      // Notify subscribers that connection is established
      this.notifySubscribers('connection', { status: 'connected' });
    };

    this.socket.onmessage = (event) => {
      try {
        if (event.data === "ping") {
          this.socket.send("pong");
          return;
        }
        
        const data = JSON.parse(event.data);
        this.notifySubscribers(data.type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
    };

    this.socket.onclose = () => {
      this.isConnecting = false;
      this.scheduleReconnect();
    };
  }

  subscribe(eventType, callback) {
    if (!this.callbacks.has(eventType)) {
      this.callbacks.set(eventType, []);
    }
    
    this.callbacks.get(eventType).push(callback);
    
    // Connect if not already connected
    this.connect();
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(eventType) || [];
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  notifySubscribers(eventType, data) {
    const callbacks = this.callbacks.get(eventType) || [];
    callbacks.forEach(callback => callback(data));
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(typeof message === 'string' ? message : JSON.stringify(message));
      return true;
    }
    return false;
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 5000); // Try to reconnect after 5 seconds
  }

  startPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.callbacks.clear();
    instance = null;
  }
}

export default WebSocketService();