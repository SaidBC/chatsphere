'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { generateApiToken } from '@/services/api';

export default function ApiTokenInitializer() {
  const { data: session } = useSession();
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApiToken = async () => {
      // Only proceed if we have a session and user ID
      if (!session?.user?.id) {
        return;
      }

      // Check if we already have a token
      const existingToken = localStorage.getItem('apiToken');
      if (existingToken) {
        console.log('API token already exists in localStorage');
        return;
      }

      setIsInitializing(true);
      setError(null);

      try {
        console.log('Initializing API token for user:', session.user.id);
        await generateApiToken(session.user.id);
        console.log('API token initialized successfully');
      } catch (err) {
        console.error('Failed to initialize API token:', err);
        setError('Failed to initialize API token. Please try refreshing the page.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApiToken();
  }, [session]);

  // This component doesn't render anything visible
  // It just handles the token initialization logic
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md shadow-lg max-w-xs">
        <p className="text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-xs bg-red-500/30 hover:bg-red-500/40 px-2 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
