import { renderHook, act } from '@testing-library/react-hooks';
import { useVote } from '../app/hooks/useVote';

// Mock the showToast function
jest.mock('../app/utils/toast', () => ({
  showToast: jest.fn()
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('useVote Hook', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation for fetch
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
  });

  it('should initialize with provided initial vote state', () => {
    const { result } = renderHook(() => useVote({ 
      postId: 'post123', 
      initialVoted: true,
      initialVoteCount: 42
    }));

    expect(result.current.isVoted).toBe(true);
    expect(result.current.voteCount).toBe(42);
  });

  it('should toggle vote state with optimistic update', async () => {
    const onVoteChangeMock = jest.fn();
    
    const { result } = renderHook(() => useVote({ 
      postId: 'post123', 
      initialVoted: false,
      initialVoteCount: 5,
      onVoteChange: onVoteChangeMock
    }));

    // Make sure initial state is correct
    expect(result.current.isVoted).toBe(false);
    expect(result.current.voteCount).toBe(5);

    // Toggle the vote
    await act(async () => {
      await result.current.toggleVote();
    });

    // Check fetch was called correctly
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/proxy/post-vote/post123',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    // Verify vote state was updated optimistically
    expect(result.current.isVoted).toBe(true);
    expect(result.current.voteCount).toBe(6);
    
    // Verify the callback was called
    expect(onVoteChangeMock).toHaveBeenCalledWith({ isVoted: true, count: 6 });
  });

  it('should revert vote state if API call fails', async () => {
    // Mock fetch to return error
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      })
    );

    const onVoteChangeMock = jest.fn();
    
    const { result } = renderHook(() => useVote({ 
      postId: 'post123', 
      initialVoted: true,
      initialVoteCount: 10,
      onVoteChange: onVoteChangeMock
    }));

    // Make sure we're starting with the right state
    expect(result.current.isVoted).toBe(true);
    expect(result.current.voteCount).toBe(10);

    // Clear the mock to track new calls
    onVoteChangeMock.mockClear();

    // Toggle vote which will fail
    await act(async () => {
      await result.current.toggleVote();
    });

    // First the optimistic update happens
    expect(onVoteChangeMock).toHaveBeenCalledWith({ isVoted: false, count: 9 });
    
    // But then it's reverted due to API error
    expect(onVoteChangeMock).toHaveBeenCalledWith({ isVoted: true, count: 10 });
    
    // Final state should be back to the original
    expect(result.current.isVoted).toBe(true);
    expect(result.current.voteCount).toBe(10);
  });

  it('should handle network errors gracefully', async () => {
    // Mock fetch to throw network error
    global.fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );

    const { result } = renderHook(() => useVote({ 
      postId: 'post123', 
      initialVoted: false,
      initialVoteCount: 5
    }));

    // Toggle vote which will encounter network error
    await act(async () => {
      await result.current.toggleVote();
    });

    // State should be back to original after the error
    expect(result.current.isVoted).toBe(false);
    expect(result.current.voteCount).toBe(5);
  });

  it('should update vote state when updateVoteState is called', () => {
    const { result } = renderHook(() => useVote({ 
      postId: 'post123', 
      initialVoted: false,
      initialVoteCount: 5
    }));

    // Update vote state directly
    act(() => {
      result.current.updateVoteState(true, 42);
    });

    // Check state was updated
    expect(result.current.isVoted).toBe(true);
    expect(result.current.voteCount).toBe(42);
  });
});
