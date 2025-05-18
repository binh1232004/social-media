'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';

/**
 * Custom hook for searching users
 * @param {number} pageSize - Number of results per page
 * @returns {Object} - User search functions and state
 */
export default function useUserSearch(pageSize = 10) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Search for users
   * @param {string} query - Search query
   * @param {number} newPage - Page number (defaults to current page)
   * @param {boolean} append - Whether to append results (for pagination) or replace
   */
  const searchUsers = useCallback(async (query, newPage = page, append = false) => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('You must be logged in to search users');
      return;
    }

    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Use timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await axios.get('/api/proxy/search', {
        params: {
          query,
          page: newPage,
          pageSize,
          t: timestamp
        }
      });
      
      if (response.status === 200 && Array.isArray(response.data)) {
        // Update results based on append flag
        setSearchResults(prev => append ? [...prev, ...response.data] : response.data);
        
        // Update pagination state
        setPage(newPage);
        setHasMore(response.data.length === pageSize);
      } else {
        console.error('Invalid search response format:', response.data);
        setError('Failed to search users: Invalid data format');
      }
    } catch (err) {
      console.error('Error searching users:', err);
      
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
  }, [page, pageSize]);

  /**
   * Load the next page of results
   * @param {string} query - Search query
   */
  const loadMore = useCallback((query) => {
    if (loading || !hasMore || !query.trim()) return;
    searchUsers(query, page + 1, true);
  }, [loading, hasMore, page, searchUsers]);

  /**
   * Reset search state
   */
  const resetSearch = useCallback(() => {
    setSearchResults([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    hasMore,
    searchUsers,
    loadMore,
    resetSearch
  };
}
