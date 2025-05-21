'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '../utils/auth';

/**
 * Custom hook for fetching a single post by ID
 * @param {string} postId - The post ID to fetch
 * @returns {Object} - Post data and loading state
 */
export default function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch post from API
  useEffect(() => {
    async function fetchPost() {
      if (!postId) return;
      
      // Skip if not in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        setError('You must be logged in to view this post');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Fetch post from our API proxy
        const response = await fetch(`/api/proxy/post/${postId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: Failed to fetch post`);
        }
        
        const postData = await response.json();
          // Transform the API data format to match our frontend format
        const transformedPost = {
          id: postData.postId || postData.id,
          userId: postData.userId,
          content: postData.content,
          // Get image from media if available
          image: postData.media && postData.media.length > 0 && postData.media[0].mediaType?.includes('image') 
            ? postData.media[0].mediaUrl 
            : null,
          likes: postData.voteCount || 0,
          comments: postData.commentCount || 0,
          createdAt: postData.postedAt || postData.createdAt || new Date().toISOString(),
          user: postData.userName || postData.user?.name || "User", // Username from API or fallback
          avatar: postData.userProfileImage || postData.user?.profileImage || "/person.png", // Profile image from API or fallback
          // Include additional detailed information
          commentList: postData.comments || [],
          isLiked: postData.isVotedByCurrentUser || false,
          tags: postData.tags || [],
          location: postData.location || null,
          shareCount: postData.shareCount || 0,
          userDetails: postData.userDetails || null
        };
        
        setPost(transformedPost);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId, refreshTrigger]);
  // Function to refresh post
  const refreshPost = (updatedPostData) => {
    if (updatedPostData) {
      // If post data is provided, update immediately without API call
      setPost(updatedPostData);
    } else {
      // Otherwise trigger a refetch from the API
      setRefreshTrigger(prev => prev + 1);
    }
  };

  return {
    post,
    loading,
    error,
    refreshPost
  };
}
