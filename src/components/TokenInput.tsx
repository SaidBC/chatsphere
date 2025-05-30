import React, { useState, useEffect } from 'react';
import { tokenApi, getTokenInstructions } from '../services/api';

interface TokenInputProps {
  onTokenValidated: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const instructions = getTokenInstructions();

  // Check if token already exists in localStorage
  useEffect(() => {
    const savedToken = tokenApi.getToken();
    if (savedToken) {
      validateToken(savedToken);
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const result = await tokenApi.verifyToken(tokenToValidate);
      
      if (result.valid) {
        // Save the token and notify parent component
        tokenApi.saveToken(tokenToValidate);
        onTokenValidated();
      } else {
        setError('The provided token is invalid. Please check and try again.');
      }
    } catch (err) {
      setError('Error validating token. Please try again.');
      console.error('Token validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      validateToken(token.trim());
    } else {
      setError('Please enter an API token');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Token Required</h2>
      <p className="mb-4 text-gray-600">
        Please enter your API token to access the ChatSphere rooms.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            API Token
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API token"
            disabled={isValidating}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isValidating || !token.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isValidating ? 'Validating...' : 'Submit Token'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showInstructions ? 'Hide Instructions' : 'How to Get a Token'}
          </button>
        </div>
      </form>
      
      {showInstructions && (
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">{instructions.title}</h3>
          <ol className="list-decimal pl-5 space-y-1">
            {instructions.steps.map((step, index) => (
              <li key={index} className="text-sm text-gray-700">{step}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-gray-600 italic">{instructions.note}</p>
        </div>
      )}
    </div>
  );
};

export default TokenInput;
