'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken, isAuthenticated, getUserInfo } from '../utils/auth';
import { subscribe } from '../utils/events';

/**
 * Custom hook to fetch the current user's avatar image
 * @returns {Object} - The avatar URL and loading state
 */
export default function useUserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState('/avatar.png'); // Default avatar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  // Fetch user avatar from API
  // useEffect(() => {
  //   async function fetchUserAvatar() {
  //     // Skip if not in browser environment
  //     if (typeof window === 'undefined') {
  //       return;
  //     }
      
  //     // Check if user is authenticated
  //     if (!isAuthenticated()) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const token = getAuthToken();
  //       // Fetch the current user's profile
  //       const {userId} = getUserInfo();
  //       console.log('Fetching user avatar for userId:', userId);
  //       const response = await axios.get(`/api/proxy/user/${userId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });

  //       if (response.status === 200 && response.data && response.data.image) {
  //         setAvatarUrl(response.data.image);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching user avatar:', err);
  //       setError(err);
  //       // Don't change the avatar on error, keep using the default or current one
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchUserAvatar();
  // }, [refreshTrigger]);
  
  // Listen for avatar refresh events
  useEffect(() => {
    // Subscribe to avatar refresh events
    const unsubscribe = subscribe('avatar-updated', () => {
      refreshAvatar();
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to manually refresh the avatar
  const refreshAvatar = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    avatarUrl,
    loading,
    error,
    refreshAvatar
  };
}
