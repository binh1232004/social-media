import { renderHook, act } from '@testing-library/react-hooks';
import { useComments } from '../app/hooks/useComment';

// Mock the showToast function
jest.mock('../app/utils/toast', () => ({
  showToast: jest.fn()
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('useComments Hook', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation for fetch
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          commentId: 'new-comment-123',
          userId: 'user123',
          content: 'Test comment',
          postedAt: '2023-05-21T12:00:00Z'
        })
      })
    );
  });

  it('should initialize with provided initial comments', () => {
    const initialComments = [
      { id: '1', content: 'Test Comment 1', user: 'User1' },
      { id: '2', content: 'Test Comment 2', user: 'User2' }
    ];

    const { result } = renderHook(() => useComments({ 
      postId: 'post123', 
      initialComments 
    }));

    expect(result.current.comments).toEqual(initialComments);
    expect(result.current.comment).toBe('');
    expect(result.current.replyTo).toBe(null);
    expect(result.current.isLoadingComments).toBe(false);
  });

  it('should add a top-level comment with optimistic update', async () => {
    const { result } = renderHook(() => useComments({ postId: 'post123' }));

    // Set the comment text
    act(() => {
      result.current.setComment('Test Comment');
    });

    // Submit the form (mock submit event)
    await act(async () => {
      await result.current.handleAddComment({ preventDefault: jest.fn() });
    });

    // Check fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/proxy/post-comment/post123',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Test Comment' })
      })
    );

    // Verify comment was added to the state (1 comment)
    expect(result.current.comments.length).toBe(1);
    
    // Verify the comment content
    expect(result.current.comments[0].content).toBe('Test comment');
    
    // Comment input should be cleared
    expect(result.current.comment).toBe('');
  });

  it('should handle reply to existing comment', async () => {
    const initialComments = [
      { id: 'comment1', content: 'Test Comment 1', user: 'User1', replies: [] }
    ];

    const { result } = renderHook(() => useComments({ 
      postId: 'post123', 
      initialComments 
    }));

    // Setup reply
    act(() => {
      result.current.handleReply('comment1', 'User1');
    });

    // Check reply state was set
    expect(result.current.replyTo).toEqual({ commentId: 'comment1', userName: 'User1' });
    expect(result.current.comment).toBe('@User1 ');

    // Submit the reply
    act(() => {
      result.current.setComment('@User1 This is a reply');
    });

    await act(async () => {
      await result.current.handleAddComment({ preventDefault: jest.fn() });
    });

    // Check fetch was called with parent comment ID
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/proxy/post-comment/post123',
      expect.objectContaining({
        body: JSON.stringify({ 
          content: '@User1 This is a reply',
          parentCommentId: 'comment1' 
        })
      })
    );

    // Reply state should be cleared
    expect(result.current.replyTo).toBe(null);
  });

  it('should handle API errors when adding comments', async () => {
    // Mock fetch to return error
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      })
    );

    const { result } = renderHook(() => useComments({ postId: 'post123' }));

    // Set the comment text
    act(() => {
      result.current.setComment('Test Comment');
    });

    // Submit the form
    await act(async () => {
      await result.current.handleAddComment({ preventDefault: jest.fn() });
    });

    // Should have no comments since API failed
    expect(result.current.comments.length).toBe(0);
  });

  it('should handle network errors gracefully', async () => {
    // Mock fetch to throw network error
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useComments({ postId: 'post123' }));

    // Set the comment text
    act(() => {
      result.current.setComment('Test Comment');
    });

    // Submit the form
    await act(async () => {
      await result.current.handleAddComment({ preventDefault: jest.fn() });
    });

    // Should have no comments since network failed
    expect(result.current.comments.length).toBe(0);
  });
});
