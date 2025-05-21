"use client";

import { useState } from 'react';
import { showToast } from '../utils/toast';

/**
 * Custom hook for post voting functionality
 * @param {Object} options - Configuration options
 * @param {string} options.postId - ID of the post to vote on
 * @param {boolean} options.initialVoted - Initial vote state (true if user has already voted)
 * @param {number} options.initialVoteCount - Initial vote count 
 * @param {Function} options.onVoteChange - Optional callback when vote state changes (useful for syncing with parent components)
 * @returns {Object} Vote state and functions
 */
export function useVote({ 
  postId, 
  initialVoted = false, 
  initialVoteCount = 0, 
  onVoteChange = null 
}) {
  // State to track voting state
  const [voteState, setVoteState] = useState({
    isVoted: initialVoted,
    count: initialVoteCount
  });

  /**
   * Update the vote state both locally and via API
   * @returns {Promise<void>}
   */
  const toggleVote = async () => {
    if (!postId) {
      showToast('Invalid post ID', 'error');
      return;
    }
    
    // Track vote state before the API call
    const wasVoted = voteState.isVoted;
    
    // Update local vote state first (optimistic update)
    const newCount = wasVoted ? Math.max(0, voteState.count - 1) : voteState.count + 1;
    const newVoteState = {
      isVoted: !wasVoted,
      count: newCount
    };
    
    setVoteState(newVoteState);
    
    // Call optional callback to sync with parent components
    if (onVoteChange) {
      onVoteChange(newVoteState);
    }
    
    try {
      // Make API request to toggle the vote
      const response = await fetch(`/api/proxy/post-vote/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success message
        const successText = wasVoted ? 'Vote removed' : 'Vote added';
        showToast(successText, 'success');
      } else {
        // If the request failed, parse the error and show a toast
        let errorMessage = 'Failed to process vote';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Error ${response.status}`;
        } catch (parseError) {
          errorMessage = `Server error (${response.status})`;
        }
        
        // Revert the optimistic update
        const revertedState = {
          isVoted: wasVoted,
          count: wasVoted ? voteState.count + 1 : Math.max(0, voteState.count - 1)
        };
        
        setVoteState(revertedState);
        
        // Call optional callback to sync with parent components
        if (onVoteChange) {
          onVoteChange(revertedState);
        }
        
        // Show appropriate error message
        if (response.status === 401) {
          showToast('Please log in to vote', 'error');
        } else if (response.status === 403) {
          showToast('You don\'t have permission to vote on this post', 'error');
        } else if (response.status === 404) {
          showToast('This post no longer exists', 'error');
        } else {
          showToast(errorMessage, 'error');
        }
        
        console.error('Vote operation failed:', errorMessage);
      }
    } catch (error) {
      // If there's a network or other error, revert the optimistic update
      const revertedState = {
        isVoted: wasVoted,
        count: wasVoted ? voteState.count + 1 : Math.max(0, voteState.count - 1)
      };
      
      setVoteState(revertedState);
      
      // Call optional callback to sync with parent components
      if (onVoteChange) {
        onVoteChange(revertedState);
      }
      
      showToast('Network error while processing vote', 'error');
      console.error('Error voting on post:', error);
    }
  };

  // Update hook state when props change (useful when post data is refreshed)
  const updateVoteState = (isVoted, count) => {
    setVoteState({ isVoted, count });
  };

  return {
    isVoted: voteState.isVoted,
    voteCount: voteState.count,
    toggleVote,
    updateVoteState
  };
}

export default useVote;
