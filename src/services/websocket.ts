// WebSocket Service for ChatSphere
// Replaces react-live-chatroom WebSocket functionality

const WS_URL = 'wss://react-live-chatroom-api-production.up.railway.app/ws';

type MessageHandler = (data: any) => void;
type ConnectHandler = () => void;

interface MessageHandlers {
  [key: string]: MessageHandler[];
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private connectHandlers: ConnectHandler[] = [];
  private messageHandlers: MessageHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private currentRoomId: string | null = null;
  
  // Connect to WebSocket server
  connect(userId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    this.userId = userId;
    const apiToken = localStorage.getItem('apiToken');
    
    if (!apiToken) {
      console.error('No API token found. Cannot connect to WebSocket.');
      return;
    }
    
    try {
      // Include token in the connection URL
      this.socket = new WebSocket(`${WS_URL}?token=${apiToken}&userId=${userId}`);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.connectHandlers.forEach(handler => handler());
        
        // Rejoin room if we were in one before reconnection
        if (this.currentRoomId) {
          this.joinRoom(this.currentRoomId);
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type } = data;
          
          if (this.messageHandlers[type]) {
            this.messageHandlers[type].forEach(handler => handler(data));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} ${event.reason}`);
        this.socket = null;
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect();
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, delay);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'User disconnect');
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.currentRoomId = null;
  }
  
  isConnected() {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
  
  // Join a chat room
  joinRoom(roomId: string) {
    if (!this.isConnected()) {
      console.error('WebSocket not connected. Cannot join room.');
      return;
    }
    
    this.currentRoomId = roomId;
    this.sendMessage('join_room', { roomId });
  }
  
  // Leave current room
  leaveRoom() {
    if (this.currentRoomId && this.isConnected()) {
      this.sendMessage('leave_room', { roomId: this.currentRoomId });
      this.currentRoomId = null;
    }
  }
  
  // Send a message to the server
  sendMessage(type: string = 'new_message', data: any = {}) {
    if (!this.isConnected()) {
      console.error('WebSocket not connected. Cannot send message.');
      return;
    }
    
    if (type === 'new_message' && typeof data === 'string') {
      // Handle simple text message case
      if (!this.currentRoomId) {
        console.error('Not in a room. Cannot send message.');
        return;
      }
      
      const messageData = {
        content: data,
        roomId: this.currentRoomId,
      };
      
      this.socket!.send(JSON.stringify({ 
        type,
        ...messageData
      }));
    } else {
      // Handle other message types with data object
      this.socket!.send(JSON.stringify({ 
        type,
        ...data
      }));
    }
  }
  
  // Register connect handler
  onConnect(handler: ConnectHandler) {
    this.connectHandlers.push(handler);
    return () => {
      this.connectHandlers = this.connectHandlers.filter(h => h !== handler);
    };
  }
  
  // Register message handler
  onMessage(type: string, handler: MessageHandler) {
    if (!this.messageHandlers[type]) {
      this.messageHandlers[type] = [];
    }
    
    this.messageHandlers[type].push(handler);
    
    return () => {
      if (this.messageHandlers[type]) {
        this.messageHandlers[type] = this.messageHandlers[type].filter(h => h !== handler);
      }
    };
  }
}

export const websocketService = new WebSocketService();
