"use client";

import { useState } from 'react';
import { showToast } from '../utils/toast';

/**
 * Custom hook for group-related functionality
 * @param {Object} options - Configuration options
 * @returns {Object} Group-related functions
 */
export function useGroup({ onSuccess, onError } = {}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState({
    totalGroups: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10
  });

  /**
   * Create a new group via the group API endpoint
   * @param {Object} groupData - Group creation data
   * @param {string} groupData.groupName - Name of the group
   * @param {string} groupData.privacy - Privacy setting ('public' or 'private')
   * @param {string} groupData.coverPhoto - URL to group cover photo (optional)
   * @returns {Promise<Object>} Created group data or error
   */
  const createGroup = async (groupData) => {
    if (!groupData.groupName) {
      showToast('Group name is required', 'error');
      return null;
    }

    setIsCreating(true);
    
    try {
      const apiUrl = '/api/proxy/group';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to create group';
        showToast(errorMessage, 'error');
        
        if (onError) {
          onError(data);
        }
        
        return null;
      }

      // Show success message and call success callback
      showToast('Group created successfully!', 'success');
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      showToast('Error creating group', 'error');
      console.error('Group creation error:', error);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    } finally {
      setIsCreating(false);
    }
  };
  /**
   * Fetch groups from the API with pagination
   * @param {Object} options - Fetch options
   * @param {number} options.page - Page number to fetch (default: 1)
   * @param {number} options.pageSize - Number of groups per page (default: 10)
   * @param {boolean} options.forceRefresh - Force refresh data with cache bypass (default: false)
   * @returns {Promise<Object>} Groups data or error
   */
  const fetchGroups = async ({ page = 1, pageSize = 10, forceRefresh = false } = {}) => {
    setIsLoading(true);

    try {      // Add a cache buster when forceRefresh is true
      const cacheBuster = forceRefresh ? `&_t=${Date.now()}` : '';
      const apiUrl = `/api/proxy/group?page=${page}&pageSize=${pageSize}${cacheBuster}`;
      
      console.log(`Fetching groups with URL: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Disable cache when force refreshing
        cache: forceRefresh ? 'no-store' : 'default',
      });const data = await response.json();
      
      console.log('API Response:', data);

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to fetch groups';
        showToast(errorMessage, 'error');
        
        if (onError) {
          onError(data);
        }
        
        return null;
      }

      // Check the structure of the response
      if (data.groups) {
        // Backend returns groups array directly
        setGroups(data.groups);
      } else if (Array.isArray(data)) {
        // Backend might return array directly
        setGroups(data);
      } else if (data.data && Array.isArray(data.data)) {
        // Some APIs nest data in a data property
        setGroups(data.data);
      } else {
        // Fallback for other structures, log and set empty array
        console.error('Unexpected API response format:', data);
        setGroups([]);
      }
      
      // Update pagination information
      setPagination({
        totalGroups: data.totalGroups || data.total || data.count || 0,
        totalPages: data.totalPages || Math.ceil((data.totalGroups || data.total || data.count || 0) / pageSize) || 0,
        currentPage: page,
        pageSize
      });
      
      return data;
    } catch (error) {
      showToast('Error fetching groups', 'error');
      console.error('Group fetch error:', error);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    groups,
    pagination,
    isLoading,
    createGroup,
    fetchGroups,
    isCreating,
    // Keep the old method name for backward compatibility
    fetchToProxyApiCreateGroup: createGroup
  };
}

export default useGroup;
