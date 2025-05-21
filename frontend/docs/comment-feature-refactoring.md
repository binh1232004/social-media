# Post Comment Feature Refactoring

This document explains the refactoring of the post comment feature into a custom React hook.

## Overview

The comment functionality has been extracted from `postCardWithMedia.js` into a dedicated custom hook called `useComments.js`. This separation of concerns:

1. Reduces the complexity of the PostCard component
2. Makes the comment functionality reusable across different components
3. Improves maintainability by isolating comment-related logic
4. Makes testing easier by separating UI from business logic

## File Structure

- `app/hooks/useComments.js`: The new custom hook that encapsulates all comment functionality
- `app/components/feed/postCardWithMedia.refactored.js`: Updated component using the hook
- `__tests__/useComments.test.js`: Tests for the comment functionality

## Implementation Details

### useComments Hook

The hook handles:

- Comment state management
- API interactions for adding comments and replies
- Optimistic updates for better UX
- Error handling
- Loading states
- Reply functionality
- Formatting timestamps

### How to Use the Hook

```jsx
const {
  comments,              // Array of comments
  comment,               // Current comment text
  setComment,            // Function to update comment text
  replyTo,               // Current reply state { commentId, userName }
  isLoadingComments,     // Loading state
  handleAddComment,      // Form submit handler
  handleReply,           // Setup reply to a comment
  cancelReply,           // Cancel reply mode
  toggleComments,        // Toggle showing comments
  formatRelativeTime     // Format timestamps
} = useComments({
  postId: 'post-123',              // Required: ID of the post
  initialComments: []              // Optional: Initial comments
});
```

### Benefits of the Refactoring

1. **Separation of Concerns**: UI and logic are now properly separated.
2. **Reduced Component Size**: `postCardWithMedia.js` is now ~40% smaller.
3. **Reusability**: Comment functionality can be used in other components.
4. **Testability**: Business logic can be tested independently from UI.
5. **Maintainability**: Changes to comment functionality only need to happen in one place.

## Converting to the New Implementation

To use the refactored version:

1. Rename `postCardWithMedia.refactored.js` to `postCardWithMedia.js`
2. Ensure imports are updated where needed
3. Run tests to verify functionality

## Testing

A comprehensive test suite has been added to verify the functionality of the comments hook, including:

- Adding new comments
- Replying to existing comments
- Error handling
- Network error handling
- State management
