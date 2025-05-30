import React, { useState } from 'react';
import { tokenApi } from '../services/api';

const TokenTester: React.FC = () => {
  const [token, setToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [decodedPayload, setDecodedPayload] = useState<any>(null);

  // Function to decode a JWT token
  const decodeToken = (tokenToDecode: string) => {
    try {
      const parts = tokenToDecode.split('.');
      if (parts.length !== 3) {
        return { error: 'Invalid token format (not a JWT token)' };
      }
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      return { error: `Failed to decode token: ${(error as Error).message}` };
    }
  };

  // Handle token input change
  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    
    // Try to decode the token as user types
    if (newToken.trim()) {
      const decoded = decodeToken(newToken);
      setDecodedPayload(decoded);
    } else {
      setDecodedPayload(null);
    }
  };

  // Test token validation
  const testToken = async () => {
    if (!token.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Try to verify the token
      const validationResult = await tokenApi.verifyToken(token);
      setResult({
        validationResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setResult({
        error: `Error during validation: ${(error as Error).message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save token to localStorage
  const saveToken = () => {
    if (!token.trim()) return;
    
    tokenApi.saveToken(token);
    setResult({
      message: 'Token saved to localStorage',
      timestamp: new Date().toISOString()
    });
  };

  const clearToken = () => {
    tokenApi.clearToken();
    setResult({
      message: 'Token cleared from localStorage',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Token Tester</h2>
      
      <div className="mb-4">
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
          API Token
        </label>
        <textarea
          id="token"
          value={token}
          onChange={handleTokenChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Paste your API token here"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={testToken}
          disabled={isLoading || !token.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Token'}
        </button>
        
        <button
          onClick={saveToken}
          disabled={isLoading || !token.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          Save Token
        </button>
        
        <button
          onClick={clearToken}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear Token
        </button>
      </div>
      
      {decodedPayload && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Decoded Payload</h3>
          <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <pre className="text-sm text-gray-800">
              {JSON.stringify(decodedPayload, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Test Result</h3>
          <div className={`p-4 rounded-md overflow-x-auto ${
            result.validationResult?.valid ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <pre className="text-sm text-gray-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenTester;
