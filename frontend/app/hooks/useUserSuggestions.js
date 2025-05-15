'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';

/**
 * A custom hook for fetching user suggestions
 * @param {number} count - The number of suggestions to fetch
 * @param {boolean} autoFetch - Whether to fetch automatically on component mount
 * @returns {Object} - The suggestions data and related functions
 */
export default function useUserSuggestions(count = 10, autoFetch = true) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Function to fetch user suggestions from the API
  const fetchSuggestions = useCallback(async (suggestionsCount = count) => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('You must be logged in to view suggestions');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Add a timestamp parameter to prevent caching issues
      const timestamp = new Date().getTime();
      const response = await axios.get(`/api/proxy/user-suggestions?count=${suggestionsCount}`);
      
      if (response.status === 200 && Array.isArray(response.data)) {
        setSuggestions(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Failed to fetch user suggestions: Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching user suggestions:', err);
      
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
  }, [count]);
  
  // Function to refresh the suggestions
  const refreshSuggestions = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fetch suggestions when the component mounts or refreshTrigger changes
  useEffect(() => {
    if (autoFetch) {
      fetchSuggestions();
    }
  }, [autoFetch, refreshTrigger, fetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions,
    fetchSuggestions
  };
}