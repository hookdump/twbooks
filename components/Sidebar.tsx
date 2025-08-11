'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiUser, FiMoon, FiSun, FiBookOpen, FiMoreHorizontal } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setDarkMode(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const menuItems = [
    {
      icon: FiHome,
      label: 'Home',
      href: '/',
      active: pathname === '/',
    },
    {
      icon: FiSearch,
      label: 'Explore',
      href: '/search',
      active: pathname === '/search',
    },
    {
      icon: FiUser,
      label: 'Profile',
      href: '/profile',
      active: pathname === '/profile',
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 xl:w-275 bg-white dark:bg-black">
      <div className="flex flex-col h-full px-2 py-2">
        {/* Logo */}
        <div className="p-3">
          <Link href="/" className="flex items-center w-fit hover:bg-twitter-gray-50 dark:hover:bg-dark-hover p-3 rounded-twitter transition-colors duration-200">
            <div className="w-8 h-8 bg-twitter-blue rounded-full flex items-center justify-center">
              <FiBookOpen className="text-white" size={20} />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-5 px-3 py-3 mx-2 rounded-twitter transition-all duration-200 group ${
                    item.active
                      ? 'font-bold'
                      : 'hover:bg-twitter-gray-50 dark:hover:bg-dark-hover'
                  }`}
                >
                  <div className="relative">
                    <Icon 
                      size={26} 
                      className={item.active ? 'text-twitter-black dark:text-dark-text' : 'text-twitter-gray-700 dark:text-dark-text'} 
                    />
                  </div>
                  <span className={`text-xl xl:inline hidden ${
                    item.active 
                      ? 'font-bold text-twitter-black dark:text-dark-text' 
                      : 'text-twitter-gray-700 dark:text-dark-text'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            
            {/* More menu item */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-5 px-3 py-3 mx-2 rounded-twitter hover:bg-twitter-gray-50 dark:hover:bg-dark-hover transition-colors duration-200 w-full text-left group"
            >
              <div className="relative">
                {darkMode ? (
                  <FiSun size={26} className="text-twitter-gray-700 dark:text-dark-text" />
                ) : (
                  <FiMoon size={26} className="text-twitter-gray-700 dark:text-dark-text" />
                )}
              </div>
              <span className="text-xl xl:inline hidden text-twitter-gray-700 dark:text-dark-text">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>

          {/* Tweet Button */}
          <div className="px-2 mt-8">
            <Link
              href="/search"
              className="twitter-button-primary w-full justify-center py-3 text-17 font-bold xl:inline-flex hidden"
            >
              Find Books
            </Link>
            <Link
              href="/search"
              className="twitter-button-primary w-12 h-12 xl:hidden flex rounded-full"
            >
              <FiSearch size={24} />
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="px-2 py-3">
          <button className="flex items-center space-x-3 p-3 rounded-twitter hover:bg-twitter-gray-50 dark:hover:bg-dark-hover transition-colors duration-200 w-full text-left">
            <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center flex-shrink-0">
              <FiBookOpen className="text-white" size={18} />
            </div>
            <div className="xl:flex hidden flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-15 text-twitter-black dark:text-dark-text truncate">
                    TWBooks Reader
                  </div>
                  <div className="text-15 text-twitter-gray-500 dark:text-dark-text-secondary truncate">
                    @twbooks
                  </div>
                </div>
                <FiMoreHorizontal className="text-twitter-gray-500 dark:text-dark-text-secondary" size={16} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}