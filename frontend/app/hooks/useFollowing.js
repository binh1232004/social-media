"use client";
import { useState, useEffect, useCallback } from 'react';
import { getUserInfo } from '../utils/auth';
import { showToast } from '../utils/toast';

/**
 * Custom hook to fetch users that the current user is following
 * @returns {Object} Following users data and loading state
 */
export function useFollowing(skip = 0, take = 10) {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  /**
   * Fetch users that the current user is following
   */
  const fetchFollowingUsers = useCallback(async (refresh = false) => {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.userId) {
      setFollowingUsers([]);
      setHasMore(false);
      return;
    }
    
    // If refreshing, reset state
    if (refresh) {
      setFollowingUsers([]);
      setHasMore(true);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate the skip value based on current items if not refreshing
      const skipValue = refresh ? 0 : skip || followingUsers.length;
      
      const response = await fetch(
        `/api/proxy/follow/following/${userInfo.userId}?skip=${skipValue}&take=${take}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch following users (${response.status})`);
      }
      
      const data = await response.json();
      
      // Update state
      if (refresh) {
        setFollowingUsers(data);
      } else {
        setFollowingUsers((prev) => [...prev, ...data]);
      }
      
      // Check if there are more items to load
      setHasMore(data.length === take);
    } catch (error) {
      console.error('Error fetching following users:', error);
      setError(error.message);
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [skip, take, followingUsers.length]);
  
  // Load following users on initial mount
  useEffect(() => {
    fetchFollowingUsers(true);
  }, [fetchFollowingUsers]);
  
  /**
   * Load more users
   */
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchFollowingUsers();
    }
  }, [isLoading, hasMore, fetchFollowingUsers]);
  
  /**
   * Refresh the data
   */
  const refresh = useCallback(() => {
    fetchFollowingUsers(true);
  }, [fetchFollowingUsers]);
  
  return {
    followingUsers,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

export default useFollowing;
