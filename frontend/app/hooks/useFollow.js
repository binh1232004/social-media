"use client";
import { useState, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { getUserInfo } from '../utils/auth';

/**
 * Custom hook for handling follow/unfollow functionality
 * @returns {Object} follow operations and state
 */
export function useFollow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Follow a user
   * @param {string} followedId - ID of the user to follow
   */
  const followUser = useCallback(async (followedId) => {
    if (!followedId) {
      setError('User ID is required');
      showToast('User ID is required', 'error');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.userId) {
        throw new Error('You must be logged in to follow users');
      }

      const response = await fetch('/api/proxy/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: userInfo.userId,
          followedId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to follow user');
      }

      showToast('Đã theo dõi thành công!', 'success');
      return data;
    } catch (error) {
      console.error('Error following user:', error);
      setError(error.message);
      showToast(error.message, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Unfollow a user
   * @param {string} followedId - ID of the user to unfollow
   */
  const unfollowUser = useCallback(async (followedId) => {
    if (!followedId) {
      setError('User ID is required');
      showToast('User ID is required', 'error');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.userId) {
        throw new Error('You must be logged in to unfollow users');
      }

      const followerId = userInfo.userId;
      const url = `/api/proxy/follow?followerId=${followerId}&followedId=${followedId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unfollow user');
      }

      showToast('Đã hủy theo dõi thành công!', 'success');
      return data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError(error.message);
      showToast(error.message, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check if a user is following another user
   * @param {string} followedId - ID of the potential followed user
   * @returns {Promise<boolean>} Is the user following the target user
   */
  const checkFollowStatus = useCallback(async (followedId) => {
    if (!followedId) return false;

    try {
      const userInfo = getUserInfo();
      if (!userInfo || !userInfo.userId) return false;

      const response = await fetch(`/api/proxy/follow/check?followerId=${userInfo.userId}&followedId=${followedId}`);
      const data = await response.json();

      return response.ok && data;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }, []);

  return {
    followUser,
    unfollowUser,
    checkFollowStatus,
    isLoading,
    error
  };
}

export default useFollow;
