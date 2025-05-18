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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-28 bg-gradient-to-r from-blue-400 to-indigo-500">
        {/* Optional banner placeholder */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Image
            src={profileImage}
            alt={`${user.name || 'User'}'s profile`}
            width={80}
            height={80}
            className="rounded-full border-4 border-white dark:border-gray-800 object-cover bg-gray-100"
            onError={() => {
              setImageError(true);
            }}
          />
        </div>
      </div>
      
      <div className="pt-12 pb-6 px-4">
        <div className="text-center mb-4">
          <Link href={`/user/${user.id}`} className="hover:underline">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.fullName}</h3>
          </Link>
          
          {user.username && (
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm line-clamp-2">
              {user.username}
            </p>
          )}
          
        </div>
          <div className="flex justify-center">
          <button
            onClick={handleFollowToggle}
            disabled={loading}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 w-full max-w-[160px] ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : isFollowing ? (
              'Following'
            ) : (
              'Follow'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
