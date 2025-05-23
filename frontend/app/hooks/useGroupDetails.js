"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { getUserInfo } from '../utils/auth';

/**
 * Custom hook for fetching and managing group details
 * @param {Object} options - Hook configuration options
 * @param {string|number} options.groupId - ID of the group to fetch
 * @param {Function} options.onSuccess - Callback on successful fetch
 * @param {Function} options.onError - Callback on error
 * @returns {Object} Group details, loading state, and fetch function
 */
export function useGroupDetails({ groupId, onSuccess, onError } = {}) {
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  
  // Store callbacks in refs to prevent dependency changes
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  
  // Track the previous groupId to prevent redundant fetches
  const prevGroupIdRef = useRef(null);
  // Track if data has been fetched for current groupId
  const dataFetchedRef = useRef(false);
  // Store current groupId in a ref to avoid dependency issues
  const groupIdRef = useRef(groupId);
  
  // Update refs when callbacks or groupId change
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    groupIdRef.current = groupId;
  }, [onSuccess, onError, groupId]);
  
  // Track if component is mounted to prevent state updates after unmounting
  const isMounted = useRef(true);
  useEffect(() => {
    // Set mounted flag to true when component mounts
    isMounted.current = true;
    
    return () => {
      // Clean up when component unmounts
      isMounted.current = false;
      dataFetchedRef.current = false;
    };
  }, []);
  
  /**
   * Fetch group details from the API
   * @param {string|number} id - Optional: GroupId to fetch (defaults to groupId from options)
   * @param {boolean} force - Force fetch even if data exists
   */
  const fetchGroupDetails = useCallback(async (id = groupIdRef.current, force = false) => {
    if (!id) {
      setError('Group ID is required');
      return null;
    }
    
    // Store current group details in a variable to avoid closure issues
    const currentGroupDetails = groupDetails;
    
    console.log(`fetchGroupDetails called for ID ${id}, force=${force}, previousId=${prevGroupIdRef.current}, dataFetched=${dataFetchedRef.current}`);

    // Skip fetch if we already have data for this group and not forcing refresh
    if (!force && dataFetchedRef.current && id === prevGroupIdRef.current && currentGroupDetails) {
      console.log(`Using cached data for group ${id}`);
      return currentGroupDetails;
    }

    // Skip if component unmounted before fetch starts
    if (!isMounted.current) {
      console.log('Component unmounted, skipping fetch');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching group details from API for ID: ${id}`);
      const response = await fetch(`/api/proxy/group/${id}`);
      const data = await response.json();

      // Skip updates if component unmounted during fetch
      if (!isMounted.current) {
        console.log('Component unmounted during fetch, skipping state update');
        return null;
      }

      if (!response.ok) {
        const errorMessage = data.error || `Failed to fetch group details (${response.status})`;
        showToast(errorMessage, 'error');
        
        setError(errorMessage);
        
        if (onErrorRef.current) {
          onErrorRef.current(data);
        }
        
        return null;
      }

      console.log('Group details fetched successfully:', data);
      
      // Make sure data is valid
      if (!data) {
        setError('No data returned from API');
        return null;
      }
      
      // Sanitize the data to ensure all expected properties exist
      const sanitizedData = {
        ...data,
        // Ensure required fields exist with default values
        groupId: data.groupId || id,
        groupName: data.groupName || 'Unnamed Group',
        description: data.description || 'No description available',
        visibility: data.visibility || 'Public',
        memberCount: data.memberCount || 0,
        image: data.image || '/group.png',
        createdBy: data.createdBy || 'Unknown',
        createdAt: data.createdAt || new Date().toISOString()
      };
      
      // Only update state if component is still mounted
      setGroupDetails(sanitizedData);
      // Update refs to track that we've fetched this data
      prevGroupIdRef.current = id;
      dataFetchedRef.current = true;
      
      if (onSuccessRef.current && isMounted.current) {
        onSuccessRef.current(sanitizedData);
      }
      
      return sanitizedData;
    } catch (error) {
      // Skip updates if component unmounted during fetch
      if (!isMounted.current) return null;
      
      const errorMessage = error.message || 'Error fetching group details';
      showToast(errorMessage, 'error');
      console.error('Error fetching group details:', error);
      
      // Create a fallback group object to prevent breaking the UI
      const fallbackGroup = {
        groupId: id,
        groupName: 'Error Loading Group',
        description: 'An error occurred while loading this group.',
        visibility: 'Public',
        memberCount: 0,
        image: '/group.png',
        createdBy: 'Unknown',
        createdAt: new Date().toISOString(),
        error: true
      };
      
      // Update state with fallback data
      if (isMounted.current) {
        setGroupDetails(fallbackGroup);
        setError(errorMessage);
      }
      
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
      
      return fallbackGroup;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [groupDetails]); // Include groupDetails as a dependency for proper caching
  
  // Initial fetch when groupId is provided and changes
  useEffect(() => {
    // Define an async function to handle the fetch
    const fetchData = async () => {
      console.log(`Initial fetch effect triggered for groupId: ${groupId}`);
      
      if (groupId) {
        // Check if we need to fetch or if we can use cached data
        const needsFetch = groupId !== prevGroupIdRef.current || !dataFetchedRef.current;
        const hasCachedData = dataFetchedRef.current && prevGroupIdRef.current === groupId && groupDetails;
        
        console.log(`Needs fetch: ${needsFetch}, Has cached data: ${hasCachedData}`);
        
        if (needsFetch) {
          try {
            // Force-refresh data if we're switching to a new group
            const forceRefresh = groupId !== prevGroupIdRef.current;
            await fetchGroupDetails(groupId, forceRefresh);
          } catch (err) {
            console.error('Error in initial fetch:', err);
            // The error is already handled in fetchGroupDetails
          }
        } else if (hasCachedData) {
          console.log('Using cached data for initial render');
        }
      }
    };
    
    // Execute the fetch
    fetchData();
  }, [groupId, fetchGroupDetails, groupDetails]);

  /**
   * Join a group using the group-members API endpoint
   * @param {string|number} id - Optional: GroupId to join (defaults to current groupId)
   * @returns {Promise<Object>} Join response or error
   */
  const joinPublicGroup = useCallback(async (id = groupIdRef.current) => {
    if (!id) {
      const errorMessage = 'Group ID is required to join a group';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return null;
    }
    const userInfo = getUserInfo();
    const requestBody = {
      userId: userInfo.userId,
      approve: true,
      groupId: id
    };
  
    
    try {
      console.log(`Sending request to join group ID: ${id}`);
      
      const response = await fetch('/api/proxy/group-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();

      // Skip updates if component unmounted during fetch
      if (!isMounted.current) {
        console.log('Component unmounted during join operation, skipping state update');
        return null;
      }

      if (!response.ok) {
        const errorMessage = data.error || `Failed to join group (${response.status})`;
        showToast(errorMessage, 'error');
        
        setError(errorMessage);
        
        if (onErrorRef.current) {
          onErrorRef.current(data);
        }
        
        return null;
      }

      console.log('Join group request successful:', data);
      
      // Show success message
      showToast('Successfully joined the group!', 'success');
      
      // Refresh group details to reflect membership status
      await fetchGroupDetails(id, true);
      
      if (onSuccessRef.current && isMounted.current) {
        onSuccessRef.current(data);
      }
      
      return data;
    } catch (error) {
      // Skip updates if component unmounted during fetch
      if (!isMounted.current) return null;
      
      const errorMessage = error.message || 'Error joining group';
      showToast(errorMessage, 'error');
      console.error('Error joining group:', error);
      
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
      
      return null;
    } finally {
      if (isMounted.current) {
        setIsJoining(false);
      }
    }
  }, [fetchGroupDetails]);
  
  return {
    groupDetails,
    isLoading,
    error,
    isJoining,
    fetchGroupDetails,
    joinPublicGroup
  };
}

export default useGroupDetails;