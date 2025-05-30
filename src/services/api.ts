// API Service for ChatSphere
// Replaces react-live-chatroom API functionality

const API_BASE_URL = 'https://react-live-chatroom-api-production.up.railway.app/api';

// Add token to all requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const apiToken = localStorage.getItem('apiToken');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // Debug log for token
  console.debug(`API Request to ${endpoint}, token exists: ${!!apiToken}`);
  
  if (apiToken) {
    headers.set('Authorization', `Bearer ${apiToken}`);
  } else {
    console.warn('No API token found in localStorage, request may fail with 401');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    console.error(`API request error: ${response.status} ${response.statusText}`);
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
};

// Room related API calls
export const roomsApi = {
  getAllRooms: async () => {
    try {
      return await fetchWithAuth('/rooms');
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },
  
  getRoom: async (roomId: string) => {
    try {
      return await fetchWithAuth(`/rooms/${roomId}`);
    } catch (error) {
      console.error('Error fetching room details:', error);
      throw error;
    }
  },
  
  createRoom: async (roomData: { name: string; description: string; isPrivate: boolean }) => {
    try {
      return await fetchWithAuth('/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData),
      });
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  deleteRoom: async (roomId: string) => {
    try {
      return await fetchWithAuth(`/rooms/${roomId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};

// User and token related API calls
export const userApi = {
  generateClientToken: async (tokenName: string, userId: string) => {
    try {
      return await fetchWithAuth('/tokens', {
        method: 'POST',
        body: JSON.stringify({ name: tokenName, userId, type: 'CLIENT' }),
      });
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      return await fetchWithAuth('/tokens/verify');
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

export const generateApiToken = async (userId: string) => {
  console.log('Generating API token for user:', userId);
  
  try {
    const tokenName = `chatsphere_client_${Date.now()}`;
    const tokenResponse = await userApi.generateClientToken(tokenName, userId);
    
    if (tokenResponse && tokenResponse.token) {
      console.log('Token generated successfully');
      localStorage.setItem('apiToken', tokenResponse.token);
      
      // Test the token with a verification request
      try {
        await userApi.verifyToken();
        console.log('Token verification successful');
        return tokenResponse.token;
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError);
        localStorage.removeItem('apiToken');
        throw new Error('Generated token failed verification');
      }
    } else {
      throw new Error('Invalid token response from server');
    }
  } catch (error) {
    console.error('Failed to generate API token:', error);
    throw error;
  }
};
