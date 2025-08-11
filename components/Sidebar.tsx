'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSearch, FiUser, FiMoon, FiSun, FiBookOpen } from 'react-icons/fi';
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
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-twitter-blue rounded-full flex items-center justify-center">
              <FiBookOpen className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-dark-text">
              TWBooks
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-full transition-colors duration-200 ${
                      item.active
                        ? 'bg-twitter-blue/10 text-twitter-blue font-medium'
                        : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-hover'
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 px-4 py-3 rounded-full w-full text-left text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors duration-200"
          >
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
            <span className="text-lg">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-dark-border">
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary text-center">
            TWBooks - Your Book Timeline
          </p>
        </div>
      </div>
    </div>
  );
}