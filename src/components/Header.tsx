"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-gray-900/80' : 'bg-gray-900/60 backdrop-blur-md'}`}>
      <div className="absolute inset-0 border-b border-gray-800/50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">ChatSphere</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/docs" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Docs
            </Link>
            <Link href="/features" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="gradient-border bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden backdrop-blur-xl bg-gray-900/80 border-t border-gray-800/50">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/docs" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 hover:text-white transition-colors duration-200">
              Docs
            </Link>
            <Link href="/features" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 hover:text-white transition-colors duration-200">
              Features
            </Link>
            <Link href="/pricing" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 hover:text-white transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-300 hover:bg-gray-800/50 hover:border-gray-700 hover:text-white transition-colors duration-200">
              Login
            </Link>
            <Link href="/signup" className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-white bg-gray-800/60 backdrop-blur-sm transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
