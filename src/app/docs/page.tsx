import Link from 'next/link';

export default function Docs() {
  return (
    <div className="relative py-16 bg-gray-950 overflow-hidden min-h-screen">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-1 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-2 rounded-full opacity-5 blur-3xl"></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose mx-auto">
          <h1>
            <span className="block text-base text-center gradient-text font-semibold tracking-wide uppercase">Documentation</span>
            <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              ChatSphere Documentation
            </span>
          </h1>
          <p className="mt-8 text-xl text-gray-300 leading-8">
            Welcome to the ChatSphere documentation. Here you'll find comprehensive guides and documentation to help you start working with ChatSphere as quickly as possible.
          </p>
        </div>
        
        <div className="mt-6 prose prose-invert max-w-prose mx-auto text-gray-300">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-12 relative group hover:border-gray-700 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-0 group-hover:opacity-30 blur-sm -z-10 transition duration-300"></div>
            <h2 className="text-white text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-gray-300">
              ChatSphere is a modern, real-time chat platform designed for seamless communication. Whether you're building a community, connecting with friends, or collaborating with colleagues, ChatSphere provides the tools you need.
            </p>
            
            <h3 className="text-white text-xl font-semibold mt-8 mb-2">Creating an Account</h3>
            <p className="text-gray-300">
              To get started with ChatSphere, you'll need to create an account. Click the "Sign Up" button in the top right corner of the page, or use the button below.
            </p>
            <div className="mt-4 mb-8">
              <Link href="/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-accent-1 to-accent-2 hover:opacity-90 transition-all duration-200">
                Create an account
              </Link>
            </div>
            
            <h3 className="text-white text-xl font-semibold mb-2">Creating Your First Chat Room</h3>
            <p className="text-gray-300">
              After signing in, you can create a new chat room by clicking the "+" button in your dashboard. Give your room a name, set permissions, and invite participants.
            </p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-12 relative group hover:border-gray-700 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-0 group-hover:opacity-30 blur-sm -z-10 transition duration-300"></div>
            <h2 className="text-white text-2xl font-bold mb-4">Features</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">Real-time Messaging</strong> - Messages are delivered instantly with no perceptible lag.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">End-to-End Encryption</strong> - Your conversations are secure and private.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">Group Chats</strong> - Create rooms for teams, communities, or friend groups.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">File Sharing</strong> - Share documents, images, and more directly in your chats.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">Cross-Platform</strong> - Access ChatSphere from any device with a consistent experience.</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-accent-1 to-accent-2 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span><strong className="text-white">Customizable Interface</strong> - Make ChatSphere your own with themes and settings.</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/features" className="text-accent-1 hover:text-accent-2 transition-colors duration-200 font-medium">
                View all features →
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-12 relative group hover:border-gray-700 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-0 group-hover:opacity-30 blur-sm -z-10 transition duration-300"></div>
            <h2 className="text-white text-2xl font-bold mb-4">API Reference</h2>
            <p className="text-gray-300">
              ChatSphere offers a comprehensive API for developers who want to integrate our platform into their applications.
            </p>
            
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mt-6 mb-4">
              <h3 className="text-lg font-medium text-white mb-3">Example API Request</h3>
              <pre className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto border border-gray-700">
                <code>
{`fetch('https://api.chatsphere.io/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    roomId: 'room_123',
    content: 'Hello, world!',
    attachments: []
  })
})`}
                </code>
              </pre>
            </div>
            <div className="mt-6">
              <Link href="#" className="text-accent-1 hover:text-accent-2 transition-colors duration-200 font-medium">
                View full API documentation →
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-12 relative group hover:border-gray-700 transition-all duration-300">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-xl opacity-0 group-hover:opacity-30 blur-sm -z-10 transition duration-300"></div>
            <h2 className="text-white text-2xl font-bold mb-4">Support</h2>
            <p className="text-gray-300">
              If you need help with anything related to ChatSphere, our support team is available 24/7. You can reach us through the following channels:
            </p>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-accent-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Email: <a href="mailto:support@chatsphere.io" className="text-accent-1 hover:text-accent-2 transition-colors duration-200">support@chatsphere.io</a></span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-accent-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span>Live Chat: Available in the bottom right corner of this page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-accent-1 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>Knowledge Base: Check our <Link href="#" className="text-accent-1 hover:text-accent-2 transition-colors duration-200">FAQ section</Link></span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-accent-1/20 to-accent-2/20 p-8 rounded-xl border border-gray-800 mt-12">
            <p className="text-center text-white text-lg">
              Ready to get started? <Link href="/signup" className="gradient-text font-medium">Sign up now</Link> or <Link href="/login" className="gradient-text font-medium">log in</Link> to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
