'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Token {
  id: string;
  token: string;
  name: string;
  type: 'USER' | 'CLIENT';
  userId: string;
  permissions: any;
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  isRevoked: boolean;
  user?: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    role: string | null;
  };
}

interface TokenListProps {
  onTokenDeleted?: () => void;
}

export default function TokenList({ onTokenDeleted }: TokenListProps) {
  const { data: session } = useSession();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'CLIENT';

  const fetchTokens = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tokens');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tokens');
      }

      const data = await response.json();
      // Filter to only show CLIENT tokens
      const clientTokens = data.filter((token: Token) => token.type === 'CLIENT');
      setTokens(clientTokens);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch tokens');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTokens();
    }
  }, [session]);

  const handleRevokeToken = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRevoked: true })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to revoke token');
      }

      // Update the token in the list
      setTokens(tokens.map(token => 
        token.id === tokenId ? { ...token, isRevoked: true } : token
      ));
    } catch (error: any) {
      setError(error.message || 'Failed to revoke token');
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete token');
      }

      // Remove the token from the list
      setTokens(tokens.filter(token => token.id !== tokenId));
      setConfirmDelete(null);
      
      if (onTokenDeleted) {
        onTokenDeleted();
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete token');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-500/10 border border-red-500/30 text-red-400">
        <p>{error}</p>
        <button 
          onClick={fetchTokens}
          className="mt-2 text-sm text-accent-1 hover:text-accent-2 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-900 rounded-xl border border-gray-800">
        <p className="text-gray-400 mb-4">No API tokens found</p>
        <p className="text-sm text-gray-500">Generate a new token to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Token
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              {isAdmin && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Expires
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {tokens.map((token) => (
              <tr key={token.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {token.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                  {token.token}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    token.type === 'CLIENT' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {token.type}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {token.user?.name || token.user?.username || token.user?.email || 'Unknown'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(token.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {token.expiresAt ? formatDate(token.expiresAt) : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {token.isRevoked ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                      Revoked
                    </span>
                  ) : token.expiresAt && new Date(token.expiresAt) < new Date() ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                      Expired
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {confirmDelete === token.id ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteToken(token.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-4">
                      {!token.isRevoked && (
                        <button
                          onClick={() => handleRevokeToken(token.id)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(token.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
