'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken, isAuthenticated } from '../utils/auth';

/**
 * Custom hook for fetching posts by user
 * @param {string} userId - The user ID to fetch posts for
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Object} - Posts data and loading state
 */
export default function useUserPosts(userId, limit = 10) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user posts from API
  useEffect(() => {
    async function fetchPosts() {
      if (!userId) return;
      
      // Skip if not in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError('You must be logged in to view posts');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const token = getAuthToken();
        
        // This is where you'd call an API to get user posts
        // For now, we'll use mock data since you might not have the posts endpoint yet
        
        // Simulating an API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock posts data - replace this with actual API call when available
        const mockPosts = [
          {
            id: 1,
            userId: userId,
            content: "Just launched my new portfolio website! Check it out and let me know what you think.",
            image: "https://source.unsplash.com/random/600x400/?website",
            likes: 89,
            comments: 12,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
          },
          {
            id: 2,
            userId: userId,
            content: "Beautiful sunset at the beach today! 🌅",
            image: "https://source.unsplash.com/random/600x400/?sunset,beach",
            likes: 142,
            comments: 24,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
          },
          {
            id: 3,
            userId: userId,
            content: "Had an amazing time at the tech conference this weekend. Met so many inspiring people!",
            image: null,
            likes: 67,
            comments: 8,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks ago
          }
        ];
        
        // When you have a posts API endpoint, replace the mock data with this:
        /*
        const response = await axios.get(`/api/proxy/user/${userId}/posts`, {
          params: { limit },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200 && Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('Invalid posts data format:', response.data);
          setError('Failed to fetch posts: Invalid data format');
        }
        */
        
        setPosts(mockPosts);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        
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

    fetchPosts();
  }, [userId, limit, refreshTrigger]);

  // Function to refresh posts
  const refreshPosts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Format posts for display
  const formattedPosts = posts.map(post => {
    // Calculate relative time
    const postDate = new Date(post.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let timeAgo;
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        timeAgo = `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      } else {
        timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      }
    } else if (diffDays === 1) {
      timeAgo = 'Yesterday';
    } else if (diffDays < 7) {
      timeAgo = `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      timeAgo = `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      timeAgo = postDate.toLocaleDateString();
    }
    
    return {
      id: post.id,
      user: post.authorName || 'User',
      avatar: post.authorImage || '/avatar.png',
      content: post.content,
      image: post.image,
      likes: post.likes || 0,
      comments: post.comments || 0,
      time: timeAgo
    };
  });

  return {
    posts: formattedPosts,
    loading,
    error,
    refreshPosts
  };
}
