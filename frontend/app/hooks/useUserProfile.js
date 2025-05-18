'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken, isAuthenticated, getUserInfo } from '../utils/auth';

/**
 * Custom hook for fetching user profile data
 * @returns {Object} - Profile data and loading state
 */
export default function useUserProfile(userId) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user profile data from API
  useEffect(() => {
    async function fetchProfileData() {
      // Skip if not in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError('You must be logged in to view profiles');
        setLoading(false);
        return;
      }      setLoading(true);
      setError(null);
      
      try {
        const token = getAuthToken();
        
        // If userId is not provided, use the userId from the decoded token
        // If that's not available either, use the 'me' endpoint
        let endpoint;
        endpoint = `/api/proxy/user/${userId}`;
        
        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 && response.data) {
          // Format the profile data
          const userData = response.data;
          
          // Format joined date
          const joinedDate = userData.joinedAt 
            ? new Date(userData.joinedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              }) 
            : 'Unknown';
          
          // Transform API data to profile format
          const formattedProfile = {
            userId: userData.userId,
            name: userData.fullName || userData.username,
            username: userData.username,
            avatar: userData.image || '/avatar.png',
            bio: userData.intro || '',
            location: '',
            followers: 0, // These might come from a different endpoint
            following: 0,
            joinedDate: joinedDate,
            email: userData.email,
            birthday: userData.birthday,
            gender: userData.gender
          };
          
          setProfileData(formattedProfile);
        } else {
          console.error('Invalid profile data format:', response.data);
          setError('Failed to fetch profile: Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        
        // Provide more detailed error message
        if (err.response) {
          setError(err.response.data?.error || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError(`Request error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [ refreshTrigger]);

  // Function to refresh profile data
  const refreshProfile = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    profileData,
    loading,
    error,
    refreshProfile
  };
}
