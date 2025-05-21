import { showToast } from "./toast";

/**
 * Add a comment to a post
 * @param {string} postId - The ID of the post to comment on
 * @param {string} content - The comment text content
 * @param {string|null} parentCommentId - Optional parent comment ID when replying to a comment
 * @param {boolean} showToastMessages - Whether to show toast notifications (default: true)
 * @returns {Promise<object|null>} The created comment object or null if failed
 */
export async function addComment(postId, content, parentCommentId = null, showToastMessages = true) {
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
      
      if (showToastMessages) {
        if (response.status === 401) {
          showToast('Please log in to add comments', 'error');
        } else if (response.status === 403) {
          showToast('You don\'t have permission to comment on this post', 'error');
        } else if (response.status === 404) {
          showToast('The post was not found or has been deleted', 'error');
        } else {
          showToast(errorMessage, 'error');
        }
      }
      
      console.error('Error adding comment:', errorMessage);
      return null;
    }

    // Show success message
    if (showToastMessages) {
      showToast(parentCommentId ? 'Reply added' : 'Comment added', 'success');
    }

    // Return the created comment
    return data;
  } catch (error) {
    if (showToastMessages) {
      showToast('Network error while adding comment', 'error');
    }
    console.error('Network error adding comment:', error);
    return null;
  }
}

/**
 * Get comments for a post
 * @param {string} postId - The ID of the post to get comments for
 * @returns {Promise<Array|null>} Array of comments or null if failed
 */
export async function getPostComments(postId) {
  try {
    // This function would fetch comments from a future API endpoint
    // For now, it's a placeholder for when you implement the GET endpoint
    const response = await fetch(`/api/proxy/post-comments/${postId}`);
    
    if (!response.ok) {
      console.error('Failed to fetch comments:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
}
