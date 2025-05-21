/**
 * Utility functions for post voting
 */
import { showToast } from './toast';

/**
 * Toggle vote on a post (add vote if not voted, remove if already voted)
 * @param {string} postId - The ID of the post to vote on
 * @param {boolean} showFeedback - Whether to show success/error toasts
 * @returns {Promise<{success: boolean, message: string}>} - Result with success status and message
 */
export async function togglePostVote(postId, showFeedback = true) {
  try {
    // Validate postId
    if (!postId) {
      const message = 'ID bài viết không hợp lệ';
      console.error(message);
      if (showFeedback) showToast(message, 'error');
      return { success: false, message };
    }

    // Make API request to toggle vote
    const response = await fetch(`/api/proxy/post-vote/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Handle response
    if (response.ok) {
      if (showFeedback) showToast('Đã cập nhật bình chọn', 'success');
      return { success: true, message: 'Bình chọn thành công' };
    } else {
      // Try to parse error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || `Lỗi: ${response.status}`;
      } catch {
        errorMessage = `Lỗi bình chọn bài viết (${response.status})`;
      }
      
      // Log and show error
      console.error(`Error voting on post: ${errorMessage}`);
      if (showFeedback) showToast(errorMessage, 'error');
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    const message = 'Lỗi kết nối khi bình chọn';
    console.error('Error toggling post vote:', error);
    if (showFeedback) showToast(message, 'error');
    return { success: false, message };
  }
}
