'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { generateApiToken } from '@/services/api';

export default function ApiTokenInitializer() {
  const { data: session } = useSession();
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Function to initialize token
    const initializeApiToken = async () => {
      // Skip if already initialized in this session
      if (initialized) return;
      
      // Only proceed if we have a session and user ID
      if (!session?.user?.id) {
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        console.log('Initializing API token for user:', session.user.id);
        const token = await generateApiToken(session.user.id);
        console.log('API token initialized successfully');
        
        // Store token in localStorage
        if (token) {
          localStorage.setItem('apiToken', token);
          setInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize API token:', err);
        // Don't show error to user since we have fallback mechanism
        // setError('Failed to initialize API token. Please try refreshing the page.');
      } finally {
        setIsInitializing(false);
      }
    };

    // Initialize token on component mount
    initializeApiToken();

    // Set up periodic token refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      if (session?.user?.id) {
        // Just check if token exists, don't show errors
        const token = localStorage.getItem('apiToken');
        if (!token) {
          console.log('Token missing, attempting to regenerate');
          initializeApiToken();
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [session, initialized]);

  // This component doesn't render anything visible
  // It just handles the token initialization logic
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md shadow-lg max-w-xs">
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setInitialized(false); // Reset initialized state to try again
          }}
          className="mt-2 text-xs bg-red-500/30 hover:bg-red-500/40 px-2 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
