'use client';

import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import ApiTokenInitializer from '@/components/ApiTokenInitializer';

// Dashboard sidebar navigation items
const navigation = [
  { name: 'Overview', href: '/dashboard', icon: DashboardIcon },
  { name: 'Rooms', href: '/dashboard/rooms', icon: ChatIcon },
  { name: 'API Tokens', href: '/dashboard/tokens', icon: ApiTokenIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if the user is authenticated
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-16 h-16 border-t-4 border-accent-1 border-solid rounded-full animate-spin"></div>
    </div>;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* API Token Initializer - handles token generation */}
      <ApiTokenInitializer />
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed for all screen sizes */}
      <div className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full overflow-y-auto bg-gray-900 border-r border-gray-800">
          {/* Sidebar logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold gradient-text">ChatSphere</span>
            </Link>
            <button
              type="button"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center px-4 py-3 border-b border-gray-800">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center text-white font-medium">
                {session?.user?.name?.[0] || session?.user?.username?.[0] || 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {session?.user?.name || session?.user?.username}
              </p>
              <p className="text-xs text-gray-400">
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white group"
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogoutIcon className="w-5 h-5 mr-3 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - No header, just content */}
      <div className="flex flex-col flex-1 min-h-screen ml-0 md:ml-72">
        {/* Mobile menu button - Fixed position */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            type="button"
            className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white shadow-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content area - Flex grow to push footer down */}
        <main className="flex-1 overflow-y-auto bg-gray-950 pt-4 md:pt-0 flex flex-col">
          <div className="p-4 md:p-8 flex-grow">
            {children}
          </div>
        </main>

        {/* Footer - Non-fixed */}
        <footer className="bg-gray-900 border-t border-gray-800 py-3 px-4 text-center text-gray-400 text-xs mt-auto">
          <p>© {new Date().getFullYear()} ChatSphere. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// Icons
function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function ApiTokenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    </svg>
  );
}
