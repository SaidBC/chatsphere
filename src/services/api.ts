/**
 * API service for communicating with the backend
 */

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Generic fetch function with error handling and authentication
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  try {
    // Create headers with existing headers from options
    const headers = new Headers(options.headers || {});
    
    // Set content type if not already set
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Try to get the session token if we're in the browser
    if (typeof window !== 'undefined') {
      // For NextAuth.js, we'll use the cookie approach since the token is stored securely
      // The middleware will extract the token from the cookie
      // No need to manually set Authorization header as cookies will be sent automatically
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Room related API calls
 */
export const roomsApi = {
  // Get all rooms
  getAllRooms: () => fetchWithAuth('/rooms'),
  
  // Get a specific room
  getRoom: (roomId: string) => fetchWithAuth(`/rooms/${roomId}`),
  
  // Create a new room
  createRoom: (roomData: { name: string; description?: string; isPrivate?: boolean }) => 
    fetchWithAuth('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    }),
  
  // Delete a room
  deleteRoom: (roomId: string) => 
    fetchWithAuth(`/rooms/${roomId}`, {
      method: 'DELETE',
    }),
    
  // Join a room
  joinRoom: (roomId: string, userId: string) => 
    fetchWithAuth(`/rooms/${roomId}/users`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),
};

/**
 * Message related API calls
 */
export const messagesApi = {
  // Get messages for a room
  getRoomMessages: (roomId: string) => 
    fetchWithAuth(`/rooms/${roomId}/messages`),
  
  // Send a message to a room
  sendMessage: (roomId: string, content: string, userId: string) => 
    fetchWithAuth(`/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, userId }),
    }),
};

/**
 * User related API calls
 */
export const usersApi = {
  // Get user profile
  getUserProfile: (userId: string) => 
    fetchWithAuth(`/users/${userId}`),
  
  // Update user profile
  updateUserProfile: (userId: string, profileData: any) => 
    fetchWithAuth(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};
