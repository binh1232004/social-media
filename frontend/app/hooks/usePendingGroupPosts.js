import { useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/toast';

export const usePendingGroupPosts = (groupId) => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const fetchPendingPosts = useCallback(async (currentPage) => {
    if (!groupId) {
      setPendingPosts([]);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/proxy/group-posts/pending/${groupId}?page=${currentPage}&pageSize=${pageSize}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch pending posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPendingPosts(prevPosts => currentPage === 1 ? data : [...prevPosts, ...data]);
      setHasMore(data.length === pageSize);
      setPage(currentPage);
    } catch (err) {
      console.error("Error in fetchPendingPosts:", err);
      setError(err.message);
      showToast(err.message, 'error');
      setHasMore(false); // Stop pagination on error
    }
    setIsLoading(false);
  }, [groupId , pageSize]);

  useEffect(() => {
    // Initial fetch or refetch if groupId or 
    setPendingPosts([]); // Reset posts when groupId or admin status changes
    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore
    if (groupId) {
      fetchPendingPosts(1);
    }
  }, [groupId,  fetchPendingPosts]);

  const loadMorePendingPosts = () => {
    if (!isLoading && hasMore) {
      fetchPendingPosts(page + 1);
    }
  };

  const refreshPendingPosts = () => {
    setPendingPosts([]);
    setPage(1);
    setHasMore(true);
    if (groupId ) {
      fetchPendingPosts(1);
    }
  };
  
  // Function to remove a post from the list after approval/denial
  const removePostFromList = (postId) => {
    setPendingPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };


  return { pendingPosts, isLoading, error, hasMore, loadMorePendingPosts, refreshPendingPosts, removePostFromList };
};
