'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TokenGenerator from '@/components/TokenGenerator';
import TokenList from '@/components/TokenList';

export default function TokensPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshList, setRefreshList] = useState(0);

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
      </div>
    );
  }

  const handleTokenGenerated = () => {
    // Trigger a refresh of the token list
    setRefreshList(prev => prev + 1);
  };

  const handleTokenDeleted = () => {
    // Trigger a refresh of the token list
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold gradient-text">API Tokens</h1>
            <Link 
              href="/dashboard/tokens/documentation" 
              className="text-accent-1 hover:text-accent-2 transition-colors flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              API Documentation
            </Link>
          </div>
          <p className="text-gray-400">
            Generate and manage API tokens to access ChatSphere programmatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TokenGenerator onTokenGenerated={handleTokenGenerated} />
            
            <div className="mt-6 bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-3">Token Types</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-accent-1 mb-1">Chat Member Tokens</h4>
                  <p className="text-sm text-gray-400">
                    Limited access tokens for members and moderators in chat rooms. Can only access rooms and messages they have permission to view.
                    <span className="block mt-1 text-yellow-400">These tokens are stored in browser cookies and not listed here.</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-accent-1 mb-1">Client API Tokens</h4>
                  <p className="text-sm text-gray-400">
                    Full access tokens for applications and integrations. Can access all rooms and messages available to the ChatSphere user.
                    <span className="block mt-1 text-yellow-400">Can be created by any ChatSphere user using the form above.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Your Tokens</h2>
            <TokenList key={refreshList} onTokenDeleted={handleTokenDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
}
