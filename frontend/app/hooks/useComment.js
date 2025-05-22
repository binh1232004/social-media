"use client";

import { useState } from 'react';
import { showToast } from '../utils/toast';

/**
 * Custom hook for managing comments functionality
 * @param {Object} options - Configuration options
 * @param {string} options.postId - ID of the post to comment on
 * @param {Array} options.initialComments - Initial comments array
 * @returns {Object} Comment state and functions
 */
export function useComment({ postId, initialComments = [] }) {
  // Comment states
  const [comments, setComments] = useState(initialComments || []);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  /**
   * Add a comment to a post
   * @param {string} content - Comment content
   * @param {string|null} parentCommentId - Optional parent comment ID for replies
   * @returns {Promise<object|null>} Created comment or null if failed
   */
  const addComment = async (content, parentCommentId = null) => {
    try {
      // Prepare request body
      const requestBody = {
        content: content
      };

      // Add parentCommentId if it's a reply
      if (parentCommentId) {
        requestBody.parentCommentId = parentCommentId;
      }

      // Send request to proxy API endpoint
      const response = await fetch(`/api/proxy/post-comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Parse response
      const data = await response.json();

      // Handle error response
      if (!response.ok) {
        const errorMessage = data.error || `Failed to add comment (${response.status})`;
        
        if (response.status === 401) {
          showToast('Please log in to add comments', 'error');
        } else if (response.status === 403) {
          showToast('You don\'t have permission to comment on this post', 'error');
        } else if (response.status === 404) {
          showToast('The post was not found or has been deleted', 'error');
        } else {
          showToast(errorMessage, 'error');
        }
        
        console.error('Error adding comment:', errorMessage);
        return null;
      }

      // Show success message
      showToast(parentCommentId ? 'Reply added' : 'Comment added', 'success');

      // Return the created comment
      return data;
    } catch (error) {
      showToast('Network error while adding comment', 'error');
      console.error('Network error adding comment:', error);
      return null;
    }
  };

  /**
   * Function to add a comment or reply at any nesting level with temp ID
   * @param {string} commentId - ID of parent comment (for replies)
   * @param {string} commentText - Content of the comment 
   * @param {Array} commentsArray - Array of comments to modify
   * @param {string} tempId - Temporary ID for optimistic update
   * @returns {Array} Updated comments array
   */
  const addNestedComment = (commentId, commentText, commentsArray, tempId) => {
    // Guard against non-array commentsArray
    if (!Array.isArray(commentsArray)) return [];
    
    return commentsArray.map(c => {
      if (c.id === commentId) {
        // Found the target comment, add a reply
        return {
          ...c,
          replies: [
            {
              id: tempId || new Date().getTime(),
              user: "You",
              text: commentText,
              content: commentText,
              time: "Just now",
              postedAt: new Date().toISOString(),
              isOptimistic: !!tempId, // Flag optimistic updates
              replies: []
            },
            ...c.replies
          ]
        };
      } else if (c.replies && c.replies.length > 0) {
        // Search in replies recursively
        return {
          ...c,
          replies: addNestedComment(commentId, commentText, c.replies, tempId)
        };
      }
      return c;
    });
  };
  
  /**
   * Function to replace an optimistic comment with the real one from the API
   * @param {Array} commentsArray - Array of comments
   * @param {string} tempId - Temporary ID to replace
   * @param {Object} realComment - Real comment data from API
   * @returns {Array} Updated comments array
   */
  const replaceOptimisticComment = (commentsArray, tempId, realComment) => {
    // Guard against non-array commentsArray
    if (!Array.isArray(commentsArray)) return [realComment];
    
    return commentsArray.map(c => {
      if (c.id === tempId) {
        return realComment;
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: replaceOptimisticComment(c.replies, tempId, realComment)
        };
      }
      return c;
    });
  };
  
  /**
   * Function to remove an optimistic comment if the API request fails
   * @param {Array} commentsArray - Array of comments
   * @param {string} tempId - Temporary ID to remove
   * @returns {Array} Updated comments array
   */
  const removeOptimisticComment = (commentsArray, tempId) => {
    // Guard against non-array commentsArray
    if (!Array.isArray(commentsArray)) return [];
    
    return commentsArray.map(c => {
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: c.replies.filter(r => r.id !== tempId)
        };
      }
      return c;
    }).filter(c => c.id !== tempId);
  };
  
  /**
   * Handle adding a comment or reply
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Save the comment text and reset input
    const commentText = comment;
    setComment("");
    
    // Show loading state
    const tempId = `temp-${Date.now()}`;
    const tempComment = {
      id: tempId,
      userId: "currentUser", // Will be replaced with actual data
      user: "You",
      text: commentText,
      content: commentText,
      time: "Just now",
      postedAt: new Date().toISOString(),
      isOptimistic: true, // Flag to identify optimistic updates
      replies: []
    };
    
    if (replyTo) {
      // Optimistic update for replies
      setComments(prev => addNestedComment(replyTo.commentId, commentText, Array.isArray(prev) ? prev : [], tempId));
      setReplyTo(null);
    } else {
      // Optimistic update for top-level comments
      setComments(prev => Array.isArray(prev) ? [tempComment, ...prev] : [tempComment]);
    }
    
    try {
      // Submit comment to API
      const parentId = replyTo ? replyTo.commentId : null;
      const newComment = await addComment(commentText, parentId);
      
      if (newComment) {
        // Format the returned comment to match our UI structure
        const apiComment = {
          id: newComment.commentId,
          userId: newComment.userId,
          user: "You", // We'd typically get user info from the API or context
          text: newComment.content,
          content: newComment.content,
          time: "Just now", // Would use formatTimeAgo(newComment.postedAt) in a real app
          postedAt: newComment.postedAt,
          replies: []
        };
        
        // Replace the temp comment with the real one
        if (replyTo) {
          setComments(prev => 
            Array.isArray(prev) ? replaceOptimisticComment(prev, tempId, apiComment) : [apiComment]
          );
        } else {
          setComments(prev => 
            Array.isArray(prev) ? prev.map(c => c.id === tempId ? apiComment : c) : [apiComment]
          );
        }
      } else {
        // Remove the optimistic comment on error
        if (replyTo) {
          setComments(prev =>
            Array.isArray(prev) ? removeOptimisticComment(prev, tempId) : []
          );
        } else {
          setComments(prev => 
            Array.isArray(prev) ? prev.filter(c => c.id !== tempId) : []
          );
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      
      // Remove the optimistic comment on error
      if (replyTo) {
        setComments(prev =>
          Array.isArray(prev) ? removeOptimisticComment(prev, tempId) : []
        );
      } else {
        setComments(prev => 
          Array.isArray(prev) ? prev.filter(c => c.id !== tempId) : []
        );
      }
      
      showToast('Error posting comment', 'error');
    }
  };

  /**
   * Set up reply to a comment
   * @param {string} commentId - ID of comment being replied to
   * @param {string} userName - Username of commenter being replied to
   */
  const handleReply = (commentId, userName) => {
    setReplyTo({ commentId, userName });
    setComment(`@${userName} `);
  };
  
  /**
   * Cancel a reply and clear form
   */
  const cancelReply = () => {
    setReplyTo(null);
    setComment("");
  };

  /**
   * Format relative time from ISO string
   * @param {string} dateString - ISO date string
   * @returns {string} Relative time string
   */
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Recently";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffSeconds = Math.floor((now - date) / 1000);
      
      if (diffSeconds < 60) {
        return "Just now";
      }
      
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      }
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) {
        return `${diffDays}d ago`;
      }
      
      // For older dates, show the date
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Unknown time";
    }
  };  /**
   * Load comments for a post
   */
  const loadComments = async () => {
    setIsLoadingComments(true);
    
    try {
      // Fetch comments from our API endpoint with nested structure
      const response = await fetch(`/api/proxy/post-comment/${postId}?nested=true`);
      if (response.ok) {
        const data = await response.json();
        console.log('Comments loaded:', data);   
        // Process and format comments from API
        const formattedComments = data.map(comment => formatCommentForDisplay(comment));
        
        setComments(formattedComments);
      } else {
        showToast('Failed to load comments', 'error');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      showToast('Failed to load comments', 'error');
    } finally {
      setIsLoadingComments(false);
    }
  };
  
  /**
   * Helper function to recursively format comments and their replies
   * @param {Object} comment - Comment from API
   * @returns {Object} Formatted comment for UI display
   */
  const formatCommentForDisplay = (comment) => {
    return {
      id: comment.commentId,
      userId: comment.userId,
      user: comment.username || "User", 
      content: comment.content,
      postedAt: comment.postedAt,
      time: formatRelativeTime(comment.postedAt),
      // Process child comments recursively if they exist
      replies: comment.childComments ? 
        comment.childComments.map(childComment => formatCommentForDisplay(childComment)) : []
    };
  };

  /**
   * Toggle comments visibility
   */
  const toggleComments = async (currentVisibility) => {
    const newVisibility = !currentVisibility;
    console.log(currentVisibility, comments, isLoadingComments);
    // If showing comments and we don't have any yet, try to load them
    if (newVisibility && comments.length === 0 && !isLoadingComments) {
      loadComments();
    }
    
    return newVisibility;
  };

  return {
    // State
    comments,
    comment,
    setComment,
    replyTo,
    isLoadingComments,
    
    // Functions
    handleAddComment,
    handleReply,
    cancelReply,
    toggleComments,
    formatRelativeTime
  };
}

export default useComment;
