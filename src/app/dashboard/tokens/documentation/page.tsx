'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TokenDocumentationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard/tokens" 
              className="text-accent-1 hover:text-accent-2 transition-colors mr-2"
            >
              ← Back to Tokens
            </Link>
            <h1 className="text-2xl font-bold gradient-text">API Documentation</h1>
          </div>
          <p className="text-gray-400">
            Learn how to use ChatSphere API with your generated tokens.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Authentication</h2>
            <p className="text-gray-400 mb-4">
              All API requests require authentication using a Bearer token. Include your API token in the Authorization header:
            </p>
            <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
              Authorization: Bearer YOUR_API_TOKEN
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Token System Overview</h2>
            <p className="text-gray-400 mb-4">
              ChatSphere uses two types of tokens for API access:
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Chat Member Tokens</h3>
                <p className="text-gray-400 mb-2">
                  Chat member tokens are automatically created when members or moderators log in and are stored in browser cookies. They provide access to resources that the chat member has permission to view and modify.
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="text-yellow-400">⚠️ Note:</span> Chat member tokens are not listed in the tokens UI and are managed automatically by the system.
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto mb-2">
                  {`// Chat member token permissions
{
  "userId": "member123",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "member",
  "type": "USER",
  "permissions": {
    "read": true,
    "write": true,
    "delete": false,
    "rooms": [] // Only rooms the member has joined
  }
}`}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Client API Tokens</h3>
                <p className="text-gray-400 mb-2">
                  Client API tokens provide access to the API for applications and integrations. Any ChatSphere user can generate these tokens using the token generator in the dashboard. They are ideal for server-to-server communication, automated scripts, and integrations.
                </p>
                <p className="text-gray-400 mb-2">
                  Client API tokens can be created in two ways:
                </p>
                <ul className="list-disc list-inside text-gray-400 mb-4 ml-2 space-y-1">
                  <li>Through the UI in the tokens dashboard</li>
                  <li>Programmatically via the API (for automation)</li>
                </ul>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto mb-2">
                  {`// Client API token permissions
{
  "userId": "client123",
  "username": "client",
  "email": "client@example.com",
  "role": "user",
  "type": "CLIENT",
  "permissions": {
    "read": true,
    "write": true,
    "delete": false,
    "rooms": [] // All rooms the user has access to
  }
}`}
                </div>
                <p className="text-gray-400 mt-2">
                  <span className="text-yellow-400">⚠️ Note:</span> Client API tokens should be kept secure as they provide access to your ChatSphere account resources.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Token Generation API</h2>
            <p className="text-gray-400 mb-4">
              While client API tokens can be created through the UI, you can also generate them programmatically for automation purposes.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Generate Client API Token</h3>
                <div className="bg-gray-800 p-2 rounded-md font-mono text-sm text-gray-300 mb-2">
                  POST /api/tokens/generate
                </div>
                <p className="text-gray-400 mb-2">
                  Generates a client API token for applications and integrations. Any ChatSphere user can create client API tokens.
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto mb-2">
                  {`// Request body
{
  "name": "Client API Token",
  "type": "CLIENT",
  "permissions": {
    "read": true,
    "write": true,
    "delete": false
  },
  "expiresAt": "2026-05-13T12:00:00Z" // Optional
}`}
                </div>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example response
{
  "id": "token123",
  "name": "Client API Token",
  "type": "CLIENT",
  "userId": "client123",
  "permissions": { "read": true, "write": true, "delete": false },
  "createdAt": "2025-05-13T12:00:00Z",
  "expiresAt": "2026-05-13T12:00:00Z",
  "fullToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Only returned once at creation
}`}
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Rooms API</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Get All Rooms</h3>
                <div className="bg-gray-800 p-2 rounded-md font-mono text-sm text-gray-300 mb-2">
                  GET /api/rooms
                </div>
                <p className="text-gray-400 mb-2">
                  Returns all public rooms and private rooms the authenticated user has access to.
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="text-accent-1">Required permissions:</span> <code className="bg-gray-800 px-1 rounded">read</code>
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example response
[
  {
    "id": "room123",
    "name": "General Chat",
    "description": "Public room for everyone",
    "isPrivate": false,
    "createdAt": "2023-01-01T12:00:00Z",
    "createdBy": "user123",
    "_count": {
      "messages": 42,
      "members": 10
    }
  }
]`}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Create Room</h3>
                <div className="bg-gray-800 p-2 rounded-md font-mono text-sm text-gray-300 mb-2">
                  POST /api/rooms
                </div>
                <p className="text-gray-400 mb-2">
                  Creates a new chat room.
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="text-accent-1">Required permissions:</span> <code className="bg-gray-800 px-1 rounded">write</code>
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto mb-2">
                  {`// Request body
{
  "name": "New Room",
  "description": "My new chat room",
  "isPrivate": false
}`}
                </div>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example response
{
  "id": "room456",
  "name": "New Room",
  "description": "My new chat room",
  "isPrivate": false,
  "createdAt": "2023-01-01T12:00:00Z",
  "createdBy": "user123",
  "_count": {
    "messages": 0,
    "members": 1
  }
}`}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Messages API</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Get Room Messages</h3>
                <div className="bg-gray-800 p-2 rounded-md font-mono text-sm text-gray-300 mb-2">
                  GET /api/rooms/{'{roomId}'}/messages
                </div>
                <p className="text-gray-400 mb-2">
                  Returns messages for a specific room.
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="text-accent-1">Required permissions:</span> <code className="bg-gray-800 px-1 rounded">read</code>
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example response
[
  {
    "id": "msg123",
    "content": "Hello everyone!",
    "createdAt": "2023-01-01T12:05:00Z",
    "roomId": "room123",
    "user": {
      "id": "user456",
      "name": "Jane Doe",
      "username": "janedoe"
    }
  }
]`}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Send Message</h3>
                <div className="bg-gray-800 p-2 rounded-md font-mono text-sm text-gray-300 mb-2">
                  POST /api/rooms/{'{roomId}'}/messages
                </div>
                <p className="text-gray-400 mb-2">
                  Sends a new message to a room.
                </p>
                <p className="text-gray-400 mb-2">
                  <span className="text-accent-1">Required permissions:</span> <code className="bg-gray-800 px-1 rounded">write</code>
                </p>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto mb-2">
                  {`// Request body
{
  "content": "Hello from the API!"
}`}
                </div>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example response
{
  "id": "msg789",
  "content": "Hello from the API!",
  "createdAt": "2023-01-01T12:10:00Z",
  "roomId": "room123",
  "userId": "user123"
}`}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Token Types & Permissions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">User Tokens</h3>
                <p className="text-gray-400">
                  User tokens have limited access to resources owned by the user who created the token.
                  They can only access rooms and messages that the user has permission to view.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Client Tokens</h3>
                <p className="text-gray-400">
                  Client tokens have broader access and can be used for integrations that need to access
                  multiple users' data. Only admin users can create client tokens.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Permission Levels</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li><code className="bg-gray-800 px-1 rounded">read</code> - View rooms and messages</li>
                  <li><code className="bg-gray-800 px-1 rounded">write</code> - Create rooms and send messages</li>
                  <li><code className="bg-gray-800 px-1 rounded">delete</code> - Delete rooms and messages (admin only)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Code Examples</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">JavaScript / Node.js</h3>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`// Example: Fetch rooms using fetch API
async function fetchRooms() {
  const response = await fetch('https://your-chatsphere-url.com/api/rooms', {
    headers: {
      'Authorization': 'Bearer YOUR_API_TOKEN'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  
  const rooms = await response.json();
  return rooms;
}`}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-accent-1 mb-2">Python</h3>
                <div className="bg-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 overflow-x-auto">
                  {`# Example: Send a message using requests
import requests

def send_message(room_id, message_content, api_token):
    url = f'https://your-chatsphere-url.com/api/rooms/{room_id}/messages'
    
    headers = {
        'Authorization': f'Bearer {api_token}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'content': message_content
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code != 201:
        raise Exception(f'Failed to send message: {response.json().get("error")}')
    
    return response.json()`}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
