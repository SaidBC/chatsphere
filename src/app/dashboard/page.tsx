'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Dashboard stats card component
function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 relative overflow-hidden group hover:border-gray-700 transition-all duration-300">
      <div className={`absolute -inset-0.5 ${color} rounded-xl opacity-0 group-hover:opacity-20 blur-sm -z-10 transition duration-300`}></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Recent activity component
function ActivityItem({ 
  title, 
  description, 
  time, 
  icon 
}: { 
  title: string; 
  description: string; 
  time: string; 
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-800 last:border-0">
      <div className="bg-gray-800 p-2 rounded-full">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, you would fetch this from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRooms([
        { id: '1', name: 'General Chat', participants: 12, messages: 243, lastActive: '2 min ago' },
        { id: '2', name: 'Design Team', participants: 5, messages: 128, lastActive: '15 min ago' },
        { id: '3', name: 'Development', participants: 8, messages: 312, lastActive: '1 hour ago' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dashboard header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
            Welcome back, {session?.user?.name || session?.user?.username || 'User'}
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Here's what's happening with your chat rooms today.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/chats/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-accent-1 to-accent-2 hover:opacity-90 focus:outline-none transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Chat Room
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Active Rooms" 
          value={rooms.length} 
          icon={<ChatIcon className="w-6 h-6" />}
          color="bg-accent-1"
        />
        <StatCard 
          title="Total Messages" 
          value={rooms.reduce((acc, room) => acc + room.messages, 0)} 
          icon={<MessageIcon className="w-6 h-6" />}
          color="bg-purple-500"
        />
        <StatCard 
          title="Total Participants" 
          value={rooms.reduce((acc, room) => acc + room.participants, 0)} 
          icon={<UsersIcon className="w-6 h-6" />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Uptime" 
          value="99.9%" 
          icon={<ChartIcon className="w-6 h-6" />}
          color="bg-green-500"
        />
      </div>

      {/* Recent activity and chat rooms */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="w-8 h-8 border-t-4 border-accent-1 border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <ActivityItem 
                  title="New message in Development"
                  description="Alex posted a new message about the API integration"
                  time="2 min ago"
                  icon={<MessageIcon className="w-5 h-5 text-accent-1" />}
                />
                <ActivityItem 
                  title="Sarah joined Design Team"
                  description="Sarah is now a member of the Design Team chat room"
                  time="15 min ago"
                  icon={<UserPlusIcon className="w-5 h-5 text-green-500" />}
                />
                <ActivityItem 
                  title="File shared in General Chat"
                  description="Michael shared a document: Q2 Planning.pdf"
                  time="1 hour ago"
                  icon={<DocumentIcon className="w-5 h-5 text-blue-500" />}
                />
                <ActivityItem 
                  title="New chat room created"
                  description="You created the Marketing chat room"
                  time="3 hours ago"
                  icon={<PlusCircleIcon className="w-5 h-5 text-purple-500" />}
                />
              </>
            )}
          </div>
        </div>

        {/* Chat rooms */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Your Chat Rooms</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="w-8 h-8 border-t-4 border-accent-1 border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="p-4 hover:bg-gray-800/50 transition-colors duration-200">
                  <Link href={`/dashboard/chats/${room.id}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center text-white font-medium">
                        {room.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{room.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {room.participants} participants • {room.messages} messages
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last active: {room.lastActive}
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 border-t border-gray-800">
            <Link
              href="/dashboard/chats"
              className="text-sm text-accent-1 hover:text-accent-2 font-medium transition-colors duration-200"
            >
              View all chat rooms →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
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

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function PlusCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
