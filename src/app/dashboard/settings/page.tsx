"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    soundEffects: true,
    language: 'english',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleToggleChange = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }, 1000);
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 gradient-text">Settings</h1>
        
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6">
            {message.text && (
              <div className={`mb-6 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              } text-sm`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSaveSettings}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-white mb-4">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Notifications</h3>
                        <p className="text-xs text-gray-500">Receive notifications for new messages and mentions</p>
                      </div>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.notifications ? 'bg-accent-1' : 'bg-gray-700'
                        }`}
                        onClick={() => handleToggleChange('notifications')}
                      >
                        <span className="sr-only">Toggle notifications</span>
                        <span
                          className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.notifications ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Dark Mode</h3>
                        <p className="text-xs text-gray-500">Use dark theme across the application</p>
                      </div>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.darkMode ? 'bg-accent-1' : 'bg-gray-700'
                        }`}
                        onClick={() => handleToggleChange('darkMode')}
                      >
                        <span className="sr-only">Toggle dark mode</span>
                        <span
                          className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-300">Sound Effects</h3>
                        <p className="text-xs text-gray-500">Play sounds for new messages and notifications</p>
                      </div>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.soundEffects ? 'bg-accent-1' : 'bg-gray-700'
                        }`}
                        onClick={() => handleToggleChange('soundEffects')}
                      >
                        <span className="sr-only">Toggle sound effects</span>
                        <span
                          className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={settings.language}
                        onChange={handleSelectChange}
                        className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 shadow-sm focus:border-accent-1 focus:outline-none focus:ring-accent-2 sm:text-sm text-white"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-white mb-4">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <button
                        type="button"
                        className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        Delete account
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        This will permanently delete your account and all associated data.
                      </p>
                    </div>
                    
                    <div>
                      <button
                        type="button"
                        className="text-sm text-accent-1 hover:text-accent-2 transition-colors duration-200"
                      >
                        Export your data
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        Download a copy of your personal data and chat history.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <button
                    type="submit"
                    className="flex justify-center rounded-md border border-transparent bg-gradient-to-r from-accent-1 to-accent-2 py-2 px-4 text-sm font-medium text-white shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-1 focus:ring-offset-2 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
