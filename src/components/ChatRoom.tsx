"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { websocketService } from "@/services/websocket";

interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  userImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatRoomProps {
  roomId: string;
  roomName: string;
}

export default function ChatRoom({ roomId, roomName }: ChatRoomProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    // Connect to WebSocket
    websocketService.connect(session.user.id);

    // Join the room
    const connectHandler = () => {
      websocketService.joinRoom(roomId);
    };

    // Register connect handler
    const unregisterConnect = websocketService.onConnect(connectHandler);

    // Register message history handler
    const unregisterMessageHistory = websocketService.onMessage(
      "message_history",
      (data) => {
        setMessages(data.messages);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    );

    // Register new message handler
    const unregisterNewMessage = websocketService.onMessage(
      "new_message",
      (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        setTimeout(scrollToBottom, 100);
      }
    );

    // Register error handler
    const unregisterError = websocketService.onMessage("error", (data) => {
      setError(data.message);
    });

    // If already connected, join the room
    if (websocketService.isConnected()) {
      websocketService.joinRoom(roomId);
    }

    // Cleanup function
    return () => {
      unregisterConnect();
      unregisterMessageHistory();
      unregisterNewMessage();
      unregisterError();
    };
  }, [session, roomId, router]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !session?.user?.id) return;

    // Send message via WebSocket
    websocketService.sendMessage(newMessage);

    // Clear the input
    setNewMessage("");
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Check if message is from current user
  const isCurrentUser = (userId: string) => {
    return userId === session?.user?.id;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Room header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
        <h2 className="text-xl font-semibold text-white">{roomName}</h2>
      </div>

      {/* Messages area with custom scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-1"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No messages yet. Be the first to send a message!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser(message.userId) ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  isCurrentUser(message.userId)
                    ? "bg-accent-1 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {!isCurrentUser(message.userId) && (
                  <div className="font-medium text-xs text-gray-300 mb-1">
                    {message.username}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="text-xs text-right mt-1 opacity-70">
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        {error && <div className="mb-2 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-accent-1 text-white px-4 py-2 rounded-r-md font-medium hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
