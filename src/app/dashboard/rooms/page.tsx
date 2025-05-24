"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  _count?: {
    messages: number;
    members: number;
  };
  messages?: number;
  members?: number;
};

export default function Rooms() {
  const { data: session } = useSession();
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    fetchRooms();
  }, [session, router]);

  // Redirect if session expires
  useEffect(() => {
    const checkSession = () => {
      if (!session) {
        router.push("/login");
      }
    };

    // Check session status periodically
    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [session, router]);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Import the API service
      const { roomsApi } = await import("react-live-chatroom");

      // Fetch rooms from the backend API
      const data: Room[] = await roomsApi.getAllRooms();
      setRooms(data);
    } catch (error: any) {
      setError("Failed to fetch rooms. Please try again.");
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Import the API service
      const { roomsApi } = await import("react-live-chatroom");

      // Create room using the backend API
      const data = await roomsApi.createRoom(newRoom);

      setRooms([...rooms, data]);
      setShowCreateModal(false);
      setNewRoom({
        name: "",
        description: "",
        isPrivate: false,
      });
    } catch (error: any) {
      setError("Failed to create room. Please try again.");
      console.error("Error creating room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      // Import the API service
      const { roomsApi } = await import("react-live-chatroom");

      // Delete room using the backend API
      await roomsApi.deleteRoom(roomId);

      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error: any) {
      setError("Failed to delete room. Please try again.");
      console.error("Error deleting room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewRoom({ ...newRoom, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewRoom({ ...newRoom, [name]: checked });
  };

  if (!session) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold gradient-text">Your Chat Rooms</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-accent-1 to-accent-2 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Room
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {isLoading && !showCreateModal ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-accent-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No chat rooms yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first chat room to start connecting with others
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-accent-1 to-accent-2 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              Create Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto chat-scrollbar pr-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden hover:border-accent-1/50 transition-colors duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {room.name}
                    </h3>
                    {room.isPrivate && (
                      <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-md flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Private
                      </span>
                    )}
                  </div>

                  {room.description && (
                    <p className="text-gray-400 mb-4 text-sm">
                      {room.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {room._count?.messages || room.messages || 0}
                      </span>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        {room._count?.members || room.members || 0}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/rooms/${room.id}`)
                        }
                        className="p-2 text-gray-400 hover:text-accent-1 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-950 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div className="inline-block align-bottom bg-gray-900 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-800">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-accent-1/20 to-accent-2/20 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-accent-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-white">
                        Create a New Chat Room
                      </h3>
                      <div className="mt-4">
                        <form onSubmit={handleCreateRoom}>
                          <div className="mb-4">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-300"
                            >
                              Room Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={newRoom.name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 shadow-sm focus:border-accent-1 focus:outline-none focus:ring-accent-2 sm:text-sm text-white"
                              placeholder="Enter room name"
                              required
                            />
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-300"
                            >
                              Description
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              value={newRoom.description}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 py-2 px-3 shadow-sm focus:border-accent-1 focus:outline-none focus:ring-accent-2 sm:text-sm text-white"
                              placeholder="Enter room description"
                            ></textarea>
                          </div>

                          <div className="mb-4 flex items-center">
                            <input
                              type="checkbox"
                              name="isPrivate"
                              id="isPrivate"
                              checked={newRoom.isPrivate}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-accent-1 focus:ring-accent-2 border-gray-700 rounded"
                            />
                            <label
                              htmlFor="isPrivate"
                              className="ml-2 block text-sm text-gray-300"
                            >
                              Private Room
                            </label>
                          </div>

                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-accent-1 to-accent-2 text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-1 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCreateModal(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
