import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-40 w-96 h-96 opacity-20 bg-accent-1 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-40 w-96 h-96 opacity-20 bg-accent-2 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Connect in real-time with</span>{' '}
                <span className="block gradient-text xl:inline">ChatSphere</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Experience seamless communication with our modern, secure, and feature-rich live chat platform. 
                Connect with friends, colleagues, and communities in real-time.
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                <div>
                  <Link 
                    href="/signup" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white gradient-border bg-gray-900 hover:bg-gray-800 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Get started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link 
                    href="/docs" 
                    className="w-full flex items-center justify-center px-8 py-3 border border-gray-700 text-base font-medium rounded-md text-gray-100 bg-gray-800 hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mt-12 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-64 sm:h-72 md:h-96 lg:h-full w-full flex items-center justify-center">
            {/* Chat UI mockup with Prisma-style design */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-1 to-accent-2 rounded-lg opacity-50 blur-sm transform rotate-1"></div>
              <div className="relative bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm font-medium text-gray-300">ChatSphere</div>
                  <div className="w-5"></div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-300">JD</span>
                      </div>
                    </div>
                    <div className="ml-3 bg-gray-700 rounded-lg p-3 text-sm text-gray-200 max-w-xs">
                      <p>Hey there! How's it going?</p>
                    </div>
                  </div>
                  <div className="flex items-start justify-end">
                    <div className="mr-3 bg-gradient-to-r from-accent-1 to-accent-2 rounded-lg p-3 text-sm text-white max-w-xs">
                      <p>Great! Just checking out ChatSphere's new interface!</p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-300">ME</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-300">JD</span>
                      </div>
                    </div>
                    <div className="ml-3 bg-gray-700 rounded-lg p-3 text-sm text-gray-200 max-w-xs">
                      <p>It looks amazing! Love the Prisma-inspired design.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-700 flex items-center">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-700 text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none"
                  />
                  <button className="ml-2 p-2 rounded-md bg-gradient-to-r from-accent-1 to-accent-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
