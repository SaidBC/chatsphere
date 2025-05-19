import React from 'react';

const features = [
  {
    name: 'Real-time Messaging',
    description: 'Experience instant communication with zero lag. Messages are delivered the moment they\'re sent.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: 'End-to-End Encryption',
    description: 'Your conversations are secure with our advanced encryption. Only you and your recipients can read your messages.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    name: 'Group Chats',
    description: 'Create and manage group conversations with friends, family, or colleagues. Share moments with everyone who matters.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'File Sharing',
    description: 'Share documents, images, and other files effortlessly. Keep everything organized in one place.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: 'Cross-Platform',
    description: 'Access ChatSphere from any device - desktop, mobile, or tablet. Your conversations sync seamlessly across all platforms.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Customizable Interface',
    description: 'Personalize your chat experience with themes, custom backgrounds, and notification settings.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-96 h-96 opacity-10 bg-accent-1 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="inline-block gradient-text text-base font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need in a modern chat platform
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
            ChatSphere combines powerful features with an intuitive interface to provide the best chatting experience.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-1 to-accent-2 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                <div className="relative bg-gray-800 p-6 rounded-lg border border-gray-700 group-hover:border-transparent transition duration-300">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-700 text-white mb-5 group-hover:bg-gradient-to-r group-hover:from-accent-1 group-hover:to-accent-2 transition duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-white mb-2">{feature.name}</h3>
                  <p className="text-base text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <div className="inline-block gradient-border bg-gray-800 px-6 py-4 rounded-lg">
            <p className="text-gray-300 text-lg">
              Ready to experience ChatSphere? <a href="/signup" className="gradient-text font-medium">Sign up now</a> and start chatting in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
