'use client';

import { FiTrendingUp, FiUser, FiSearch } from 'react-icons/fi';

export default function RightSidebar() {
  const trendingTopics = [
    { topic: "Reading Goals", tweets: "12.5K" },
    { topic: "BookClub", tweets: "8,942" },
    { topic: "Fantasy Books", tweets: "25.2K" },
    { topic: "Science Fiction", tweets: "18.7K" },
    { topic: "Book Reviews", tweets: "32.1K" },
  ];

  const whoToFollow = [
    {
      name: "Penguin Random House",
      username: "penguinrandom",
      verified: true,
    },
    {
      name: "Goodreads",
      username: "goodreads", 
      verified: true,
    },
    {
      name: "Book Riot",
      username: "bookriot",
      verified: false,
    },
  ];

  return (
    <div className="sticky top-0 h-screen overflow-y-auto hide-scrollbar p-4">
      <div className="space-y-4">
        {/* Search Box */}
        <div className="bg-twitter-gray-50 dark:bg-dark-secondary rounded-twitter p-3">
          <div className="flex items-center space-x-3">
            <FiSearch className="text-twitter-gray-500 dark:text-dark-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search Books"
              className="bg-transparent flex-1 outline-none text-15 text-twitter-black dark:text-dark-text placeholder-twitter-gray-500 dark:placeholder-dark-text-secondary"
            />
          </div>
        </div>

        {/* What's Happening */}
        <div className="bg-twitter-gray-50 dark:bg-dark-secondary rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-twitter-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold text-twitter-black dark:text-dark-text">
              What&rsquo;s happening
            </h2>
          </div>
          <div>
            {trendingTopics.map((trend, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-twitter-gray-100 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <FiTrendingUp className="text-twitter-gray-500 dark:text-dark-text-secondary" size={14} />
                      <span className="text-13 text-twitter-gray-500 dark:text-dark-text-secondary">
                        Trending in Books
                      </span>
                    </div>
                    <div className="font-bold text-15 text-twitter-black dark:text-dark-text mt-1">
                      {trend.topic}
                    </div>
                    <div className="text-13 text-twitter-gray-500 dark:text-dark-text-secondary">
                      {trend.tweets} Tweets
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="px-4 py-3">
              <button className="text-15 text-twitter-blue hover:underline">
                Show more
              </button>
            </div>
          </div>
        </div>

        {/* Who to Follow */}
        <div className="bg-twitter-gray-50 dark:bg-dark-secondary rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-twitter-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold text-twitter-black dark:text-dark-text">
              Who to follow
            </h2>
          </div>
          <div>
            {whoToFollow.map((user, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-twitter-gray-100 dark:hover:bg-dark-hover cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-twitter-gray-200 dark:bg-dark-border rounded-full flex items-center justify-center">
                      <FiUser className="text-twitter-gray-500 dark:text-dark-text-secondary" size={18} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-15 text-twitter-black dark:text-dark-text">
                          {user.name}
                        </span>
                        {user.verified && (
                          <div className="w-4 h-4 bg-twitter-blue rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="text-15 text-twitter-gray-500 dark:text-dark-text-secondary">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                  <button className="twitter-button-secondary px-4 py-1.5 text-15 font-bold">
                    Follow
                  </button>
                </div>
              </div>
            ))}
            <div className="px-4 py-3">
              <button className="text-15 text-twitter-blue hover:underline">
                Show more
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-4 py-2">
          <div className="text-13 text-twitter-gray-500 dark:text-dark-text-secondary space-y-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Ads info</a>
              <a href="#" className="hover:underline">More</a>
            </div>
            <div>
              © 2024 TWBooks, Inc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}