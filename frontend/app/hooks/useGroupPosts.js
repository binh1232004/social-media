"use client";
import { useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { formatDistance } from 'date-fns';

/**
 * Custom hook for fetching group posts
 * @param {string} groupId - The ID of the group
 * @returns {Object} Group posts data and functions
 */
export function useGroupPosts(groupId) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  /**
   * Format post data from API response to match the expected format for PostCard
   */
  const formatPostData = (apiPosts) => {
    return apiPosts.map(post => ({
      id: post.postId,
      userId: post.userId,
      user: post.userName || "User", // The API might not return userName, so we use a placeholder
      avatar: post.userAvatar || "/person.png",
      content: post.content,
      media: post.media ? post.media.map(m => ({
        url: m.mediaUrl,
        type: m.mediaType,
      })) : [],
      likes: post.voteCount,
      comments: post.commentCount,
      time: formatDistance(new Date(post.postedAt), new Date(), { addSuffix: true }),
      isLiked: post.isVotedByCurrentUser,
      postedAt: post.postedAt,
      // Add any other fields needed by PostCard
    }));
  };
  /**
   * Fetch posts for a specific group
   * @param {boolean} refresh - Whether to refresh and reset pagination
   */
  const fetchGroupPosts = useCallback(async (refresh = false) => {
    if (!groupId) return;
    
    // If refreshing, reset pagination
    if (refresh) {
      setPage(1);
      setHasMore(true);
    }
    
    // Don't fetch if there are no more posts and we're not refreshing
    if (!hasMore && !refresh) return;
    
    const currentPage = refresh ? 1 : page;
    
    setIsLoading(true);
    setError(null);    try {
      const response = await fetch(`/api/proxy/group-posts/${groupId}?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch group posts');
      }

      // If we get fewer posts than requested, there are no more posts
      if (data.length < pageSize) {
        setHasMore(false);
      }
      
      // Format the data to match the PostCard component expectations
      const formattedPosts = formatPostData(data);
      
      if (refresh) {
        setPosts(formattedPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...formattedPosts]);
      }
      
      // Only increment page if not refreshing
      if (!refresh) {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching group posts:', error);
      setError(error.message);
      showToast(error.message, 'error');    } finally {
      setIsLoading(false);
    }
  }, [groupId, page, hasMore, pageSize]);

  /**
   * Load more posts (pagination)
   */
  const loadMorePosts = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchGroupPosts();
    }
  }, [fetchGroupPosts, isLoading, hasMore]);

  /**
   * Refresh the posts list
   */
  const refreshPosts = useCallback(() => {
    fetchGroupPosts(true);
  }, [fetchGroupPosts]);

  /**
   * Add a new post to the list
   * @param {Object} newPost - The new post to add
   */
  const addPost = useCallback((newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);
  // Initial fetch when groupId changes
  useEffect(() => {
    if (groupId) {
      // Reset everything when groupId changes
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchGroupPosts(true);
    }
  }, [groupId, fetchGroupPosts]);

  return {
    posts,
    isLoading,
    error,
    hasMore,
    loadMorePosts,
    refreshPosts,
    addPost
  };
}