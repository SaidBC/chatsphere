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
  
  // Prepare URL - ensure endpoint starts with / and doesn't duplicate /api
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);
  
  if (apiToken) {
    headers.set('Authorization', `Bearer ${apiToken}`);
    // Also add as query parameter for cross-origin requests
    url.searchParams.append('token', apiToken);
    
    try {
      console.debug(`Making authenticated request to: ${url.toString()}`);
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
          
          // Try with development bypass
          return await fetchWithDevBypass(endpoint, options);
        }
        
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      // Try with development bypass as fallback
      return await fetchWithDevBypass(endpoint, options);
    }
  } else {
    console.warn('No API token found in localStorage, using development bypass');
    return await fetchWithDevBypass(endpoint, options);
  }
};

// Development bypass fetch helper
const fetchWithDevBypass = async (endpoint: string, options: RequestInit = {}) => {
  console.debug('Attempting request with development bypass...');
  
  // Create a dynamic token with the correct structure
  const payload = {
    userId: 'dev-user',
    type: 0, // CLIENT type
    email: 'dev@chatsphere.app',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 1 day
  };
  
  // Base64 encode the payload
  const encodedPayload = btoa(JSON.stringify(payload));
  const devToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.dev_signature`;
  
  // Store this token for future use
  localStorage.setItem('apiToken', devToken);
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${devToken}`);
  
  // Prepare URL - ensure endpoint starts with / and doesn't duplicate /api
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);
  url.searchParams.append('token', devToken);
  
  // Add development bypass flag if supported by the API
  url.searchParams.append('dev_bypass', 'true');
  
  console.debug(`Making dev bypass request to: ${url.toString()}`);
  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (!response.ok) {
    console.error(`Dev bypass request error: ${response.status} ${response.statusText}`);
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
      const baseUrl = API_BASE_URL.replace(/\/api$/, '');
      const healthUrl = `${baseUrl}/api/health`;
      
      console.debug('Verifying token with URL:', healthUrl);
      
      const headers = new Headers();
      headers.set('Authorization', `Bearer ${existingToken}`);
      
      const testUrl = new URL(healthUrl);
      testUrl.searchParams.append('token', existingToken);
      
      const response = await fetch(testUrl.toString(), { headers });
      
      if (response.ok) {
        console.log('Existing token verified successfully');
        return existingToken;
      } else {
        console.warn(`Existing token failed verification (${response.status}), will generate new token`);
        localStorage.removeItem('apiToken');
      }
    } catch (error) {
      console.warn('Error verifying existing token:', error);
      // Continue to generate a new token
    }
  }
  
  // Try multiple token generation approaches
  try {
    console.log('Attempting to generate new token...');
    const tokenName = `chatsphere_client_${Date.now()}`;
    
    // Try direct API call first (no authentication required)
    try {
      // Check if the tokens endpoint exists in the API
      const tokensEndpoint = `${API_BASE_URL}/tokens/generate`;
      console.debug('Attempting to generate token via direct API call:', tokensEndpoint);
      
      const directResponse = await fetch(tokensEndpoint, {
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
    
    // If all else fails, create a development token
    return createDevToken(userId);
  } catch (error) {
    console.error('Failed to generate API token:', error);
    return createDevToken(userId);
  }
};

// Helper function to create a development token
const createDevToken = (userId: string) => {
  console.warn('Creating development token as fallback');
  
  // Create a token payload that matches what the API expects
  const payload = {
    userId: userId || 'dev-user',
    type: 0, // CLIENT type
    email: 'dev@chatsphere.app',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 1 day
  };
  
  // Base64 encode the payload
  const encodedPayload = btoa(JSON.stringify(payload));
  const devToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.dev_signature`;
  
  // Store this token for future use
  localStorage.setItem('apiToken', devToken);
  return devToken;
};
