'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';

export default function UserSuggestionCard({ user, onFollowToggle }) {
  const [isFollowing, setIsFollowing] = useState(user?.isFollowing || false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    try {
      // Call the follow API
      await axios.post(`/api/proxy/follow/${user.id}`);
      
      // Update local state
      setIsFollowing(!isFollowing);
      
      // Notify parent component
      if (onFollowToggle) {
        onFollowToggle(user.id, !isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback image for users without a profile picture
  const profileImage = imageError || !user?.image ? '/avatar.png' : user.image;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-32 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="5" fill="white" />
            <circle cx="30" cy="10" r="5" fill="white" />
            <circle cx="50" cy="10" r="5" fill="white" />
            <circle cx="70" cy="10" r="5" fill="white" />
            <circle cx="20" cy="20" r="5" fill="white" />
            <circle cx="40" cy="20" r="5" fill="white" />
            <circle cx="60" cy="20" r="5" fill="white" />
            <circle cx="10" cy="30" r="5" fill="white" />
            <circle cx="30" cy="30" r="5" fill="white" />
            <circle cx="50" cy="30" r="5" fill="white" />
            <circle cx="70" cy="30" r="5" fill="white" />
          </svg>
        </div>
        
        {/* Profile image with animated border */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 transition-all duration-300">
          <div className={`rounded-full ${hovered ? 'ring-4 ring-blue-500 ring-opacity-60' : 'ring-4 ring-white dark:ring-gray-800'} transition-all duration-300`}>
            <Image
              src={profileImage}
              alt={`${user.fullName || 'User'}'s profile`}
              width={90}
              height={90}
              className="rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300 shadow-md"
              onError={() => {
                setImageError(true);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-16 pb-6 px-5">
        <div className="text-center mb-4">
          <Link href={`/user/${user.id}`} className="hover:underline group-hover:text-blue-600 transition-colors duration-200">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.fullName || user.username}</h3>
          </Link>
          
          {user.username && (
            <div className="mt-1.5 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                @{user.username}
              </span>
            </div>
          )}
          
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleFollowToggle}
            disabled={loading}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-full max-w-[160px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isFollowing
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý
              </span>
            ) : isFollowing ? (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Đang theo dõi
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Theo dõi
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
