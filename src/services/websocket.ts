/**
 * WebSocket service for real-time communication with the backend
 */

// WebSocket server URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';

type MessageHandler = (message: any) => void;
type ConnectionHandler = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private roomId: string | null = null;
  
  /**
   * Check if the WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Connect to the WebSocket server
   */
  connect(userId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.userId = userId;
    
    try {
      this.socket = new WebSocket(WS_URL);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.connectionHandlers.forEach(handler => handler());
        
        // Clear any reconnect timer
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const type = data.type;
          
          if (this.messageHandlers.has(type)) {
            this.messageHandlers.get(type)?.forEach(handler => handler(data));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect after 3 seconds
        this.reconnectTimer = setTimeout(() => {
          if (this.userId) {
            this.connect(this.userId);
          }
        }, 3000);
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.userId) {
      console.error('Cannot join room: WebSocket not connected or user not set');
      return;
    }
    
    this.roomId = roomId;
    
    this.socket.send(JSON.stringify({
      type: 'join',
      userId: this.userId,
      roomId
    }));
  }

  /**
   * Send a message to the current room
   */
  sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN || !this.userId || !this.roomId) {
      console.error('Cannot send message: WebSocket not connected or room not joined');
      return;
    }
    
    this.socket.send(JSON.stringify({
      type: 'message',
      content,
      userId: this.userId,
      roomId: this.roomId
    }));
  }

  /**
   * Register a message handler for a specific message type
   */
  onMessage(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    
    this.messageHandlers.get(type)?.push(handler);
    
    // Return a function to unregister the handler
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        this.messageHandlers.set(
          type,
          handlers.filter(h => h !== handler)
        );
      }
    };
  }

  /**
   * Register a connection handler
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    
    // Return a function to unregister the handler
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.userId = null;
    this.roomId = null;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
