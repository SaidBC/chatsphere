'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface TokenGeneratorProps {
  onTokenGenerated?: (token: any) => void;
}

export default function TokenGenerator({ onTokenGenerated }: TokenGeneratorProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLIENT', // Only CLIENT type tokens can be created via UI
    expiresAt: '',
    permissions: {
      rooms: [],
      read: true,
      write: true,
      delete: false
    }
  });

  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'CLIENT';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setGeneratedToken(null);

    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate token');
      }

      const data = await response.json();
      setSuccess('Token generated successfully!');
      setGeneratedToken(data.fullToken);
      setShowToken(true);
      
      // Reset form
      setFormData({
        name: '',
        type: 'CLIENT',
        expiresAt: '',
        permissions: {
          rooms: [],
          read: true,
          write: true,
          delete: false
        }
      });

      if (onTokenGenerated) {
        onTokenGenerated(data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to generate token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Generate API Token</h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {success && generatedToken && (
        <div className="mb-4 p-4 rounded-md bg-green-500/10 border border-green-500/30 text-green-400">
          <p className="font-medium mb-2">{success}</p>
          <div className="bg-gray-800 p-3 rounded-md font-mono text-sm break-all">
            {showToken ? generatedToken : '••••••••••••••••••••••••••••••••'}
            <button
              onClick={() => setShowToken(!showToken)}
              className="ml-2 text-accent-1 hover:text-accent-2 transition-colors"
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedToken);
                setSuccess('Token copied to clipboard!');
              }}
              className="ml-2 text-accent-1 hover:text-accent-2 transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-yellow-400 text-sm">
            ⚠️ Save this token securely. You won't be able to see it again!
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Token Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent"
            placeholder="My API Token"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-300 mb-1">
            Expiration Date (Optional)
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={formData.expiresAt}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-1 focus:border-transparent"
          />
        </div>
        
        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-300 mb-2">
            Permissions
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="read"
                name="read"
                checked={formData.permissions.read}
                onChange={handlePermissionChange}
                className="h-4 w-4 text-accent-1 focus:ring-accent-2 border-gray-700 rounded"
              />
              <label htmlFor="read" className="ml-2 block text-sm text-gray-300">
                Read (View messages and rooms)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="write"
                name="write"
                checked={formData.permissions.write}
                onChange={handlePermissionChange}
                className="h-4 w-4 text-accent-1 focus:ring-accent-2 border-gray-700 rounded"
              />
              <label htmlFor="write" className="ml-2 block text-sm text-gray-300">
                Write (Send messages)
              </label>
            </div>
            {isAdmin && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="delete"
                  name="delete"
                  checked={formData.permissions.delete}
                  onChange={handlePermissionChange}
                  className="h-4 w-4 text-accent-1 focus:ring-accent-2 border-gray-700 rounded"
                />
                <label htmlFor="delete" className="ml-2 block text-sm text-gray-300">
                  Delete (Remove messages and rooms)
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-accent-1 to-accent-2 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? 'Generating...' : 'Generate Token'}
          </button>
        </div>
      </form>
    </div>
  );
}
