import React, { useState, useEffect } from 'react';
import TokenInput from './TokenInput';
import { tokenApi } from '../services/api';

interface AuthenticatedContentProps {
  children: React.ReactNode;
}

const AuthenticatedContent: React.FC<AuthenticatedContentProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage and validate it
    const checkAuthentication = async () => {
      setIsLoading(true);
      const token = tokenApi.getToken();
      
      if (token) {
        try {
          const result = await tokenApi.verifyToken(token);
          setIsAuthenticated(result.valid);
        } catch (error) {
          console.error('Error validating token:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleTokenValidated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    tokenApi.clearToken();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <div className="bg-gray-100 p-2 flex justify-end">
            <button 
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          {children}
        </div>
      ) : (
        <TokenInput onTokenValidated={handleTokenValidated} />
      )}
    </div>
  );
};

export default AuthenticatedContent;
