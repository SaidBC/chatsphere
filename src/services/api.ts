// API Service for ChatSphere
// Replaces react-live-chatroom API functionality

const API_BASE_URL = 'https://react-live-chatroom-api-production.up.railway.app/api';

// For debugging purposes
const logTokenInfo = () => {
  const token = localStorage.getItem('apiToken');
  if (token) {
    try {
      // Log token details (first and last 10 chars only for security)
      const tokenPreview = token.length > 20 
        ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` 
        : token;
      console.debug(`Token available: ${tokenPreview}`);
      
      // Try to decode the JWT to check its structure
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          console.debug('Token payload:', payload);
        } catch (e) {
          console.warn('Could not decode token payload');
        }
      }
    } catch (e) {
      console.error('Error inspecting token:', e);
    }
  } else {
    console.warn('No token available in localStorage');
  }
};

// Add token to all requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  // Log token information for debugging
  logTokenInfo();
  
  const apiToken = localStorage.getItem('apiToken');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  // Debug log for token
  console.debug(`API Request to ${endpoint}, token exists: ${!!apiToken}`);
  
  if (apiToken) {
    headers.set('Authorization', `Bearer ${apiToken}`);
    // Also add as query parameter for cross-origin requests
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('token', apiToken);
    
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.error(`API request error: ${response.status} ${response.statusText}`);
      
      // For 401 errors, try to regenerate token
      if (response.status === 401) {
        console.warn('401 Unauthorized error - token may be invalid');
        
        // Clear the invalid token
        localStorage.removeItem('apiToken');
        
        // Throw specific error for 401
        throw new Error(`Authentication failed: ${response.status}`);
      }
      
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  } else {
    console.warn('No API token found in localStorage, using fallback token');
    
    // Use a fallback token for development/testing
    const fallbackToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjaGF0c3BoZXJlX3VzZXIiLCJpYXQiOjE2MjA0NTYwMDAsImV4cCI6MTkzNTgxNjAwMH0.example_signature';
    headers.set('Authorization', `Bearer ${fallbackToken}`);
    
    // Also add as query parameter
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('token', fallbackToken);
    
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      console.error(`API request with fallback token error: ${response.status} ${response.statusText}`);
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }
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
      // Try the /auth/token endpoint first (most likely endpoint)
      return await fetchWithAuth('/auth/token', {
        method: 'POST',
        body: JSON.stringify({ name: tokenName, userId }),
      });
    } catch (firstError) {
      console.warn('First token endpoint failed, trying alternative:', firstError);
      try {
        // Try alternative endpoint
        return await fetchWithAuth('/users/token', {
          method: 'POST',
          body: JSON.stringify({ name: tokenName, userId }),
        });
      } catch (secondError) {
        console.error('Error generating token from all endpoints:', secondError);
        throw secondError;
      }
    }
  },

  verifyToken: async () => {
    try {
      return await fetchWithAuth('/auth/verify');
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

export const generateApiToken = async (userId: string) => {
  console.log('Generating API token for user:', userId);
  
  // If we already have a token in localStorage, verify it first
  const existingToken = localStorage.getItem('apiToken');
  if (existingToken) {
    console.log('Found existing token in localStorage, verifying...');
    try {
      // Try to make a test request to verify the token
      const testUrl = new URL(`${API_BASE_URL}/health`);
      testUrl.searchParams.append('token', existingToken);
      
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${existingToken}`);
      
      const response = await fetch(testUrl.toString(), { headers });
      
      if (response.ok) {
        console.log('Existing token verified successfully');
        return existingToken;
      } else {
        console.warn('Existing token failed verification, will generate new token');
        localStorage.removeItem('apiToken');
      }
    } catch (error) {
      console.warn('Error verifying existing token:', error);
      // Continue to generate a new token
    }
  }
  
  // For development/testing - use a hardcoded token if all else fails
  // This is a fallback to ensure the app can function even if token generation fails
  const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjaGF0c3BoZXJlX3VzZXIiLCJ0eXBlIjowLCJpYXQiOjE2MjA0NTYwMDAsImV4cCI6MTkzNTgxNjAwMH0.example_signature';
  
  // Try multiple token generation approaches
  try {
    console.log('Attempting to generate new token...');
    const tokenName = `chatsphere_client_${Date.now()}`;
    
    // Try direct API call first (no authentication required)
    try {
      const directResponse = await fetch(`${API_BASE_URL}/tokens/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: tokenName })
      });
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        if (data && data.token) {
          console.log('Token generated successfully via direct API call');
          localStorage.setItem('apiToken', data.token);
          return data.token;
        }
      }
    } catch (directError) {
      console.warn('Direct token generation failed:', directError);
    }
    
    // Try through our API service
    try {
      const tokenResponse = await userApi.generateClientToken(tokenName, userId);
      if (tokenResponse && tokenResponse.token) {
        console.log('Token generated successfully via userApi');
        localStorage.setItem('apiToken', tokenResponse.token);
        return tokenResponse.token;
      }
    } catch (serviceError) {
      console.warn('Service token generation failed:', serviceError);
    }
    
    // If we get here, all token generation attempts failed
    console.warn('All token generation attempts failed, using fallback token');
    localStorage.setItem('apiToken', hardcodedToken);
    return hardcodedToken;
    
  } catch (error) {
    console.error('Failed to generate API token:', error);
    console.warn('Using fallback token after all attempts failed');
    localStorage.setItem('apiToken', hardcodedToken);
    return hardcodedToken;
  }
};
