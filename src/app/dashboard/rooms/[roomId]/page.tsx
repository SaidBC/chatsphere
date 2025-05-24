'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ChatRoom from '@/components/ChatRoom';
import { roomsApi } from 'react-live-chatroom';

interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
}

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const fetchRoom = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const data = await roomsApi.getRoom(params.roomId);
        setRoom(data);
      } catch (error: any) {
        console.error('Error fetching room:', error);
        setError('Failed to load room. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [session, params.roomId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-md mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/dashboard/rooms')}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl text-gray-400 mb-4">Room not found</div>
        <button
          onClick={() => router.push('/dashboard/rooms')}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatRoom roomId={params.roomId} roomName={room.name} />
    </div>
  );
}
