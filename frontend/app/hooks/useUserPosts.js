"use client";

import { useState, useEffect, useCallback } from "react";
import { isAuthenticated } from "../utils/auth";
/**
 * Custom hook for fetching posts by user with infinite scrolling
 * @param {string} userId - The user ID to fetch posts for
 * @param {number} pageSize - Number of posts to fetch per page
 * @returns {Object} - Posts data, loading state, and functions to load more posts
 */
export default function useUserPosts(userId, pageSize = 10) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Handle null userId scenario gracefully
    const validUserId = userId || null;
    // Function to fetch posts from API
    const fetchPosts = useCallback(
        async (pageNum = 1, shouldAppend = false) => {
            if (!validUserId) {
                setInitialLoading(false);
                setLoading(false);
                setError("No user ID provided");
                return;
            }

            // Skip if not in browser environment
            if (typeof window === "undefined") {
                return;
            }

            // Check if user is authenticated
            if (!isAuthenticated()) {
                setError("You must be logged in to view posts");
                setInitialLoading(false);
                setLoading(false);
                return;
            }

            // Set appropriate loading state
            if (pageNum === 1) {
                setInitialLoading(true);
            } else {
                setLoading(true);
            }

            setError(null);

            try {
                // Set up the base URL for the API request
                let url = `/api/proxy/user-posts`;

                // Create query params
                const params = new URLSearchParams();
                params.append("userId", validUserId);
                params.append("page", pageNum);
                params.append("pageSize", pageSize);

                const response = await fetch(`${url}?${params.toString()}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error ||
                            `Error ${response.status}: Failed to fetch posts`
                    );
                }

                const postsData = await response.json();
                // Check if we've reached the end of the data
                if (
                    !Array.isArray(postsData) ||
                    postsData.length === 0 ||
                    postsData.length < pageSize
                ) {
                    setHasMore(false);
                }

                // Transform the API data format to match our frontend format
                const transformedPosts = Array.isArray(postsData)
                    ? await Promise.all(postsData.map(async (post) => {
                          // Process and normalize media items if they exist
                          const normalizedMedia =
                              post.media?.map((mediaItem) => {
                                  // Ensure mediaType is always correct
                                  let mediaType = "unknown";

                                  if (!mediaItem.mediaType) {
                                      // Try to detect type from URL if mediaType is missing
                                      const url = mediaItem.mediaUrl || "";
                                      if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
                                          mediaType = "image";
                                      } else if (url.match(/\.(pdf)$/i)) {
                                          mediaType = "document";
                                      } else if (url.match(/\.(doc|docx)$/i)) {
                                          mediaType = "document";
                                      }
                                  } else {
                                      // Use the provided mediaType but ensure it's normalized
                                      if (
                                          mediaItem.mediaType.includes("image")
                                      ) {
                                          mediaType = "image";
                                      } else if (
                                          mediaItem.mediaType.includes("pdf") ||
                                          mediaItem.mediaType.includes("doc") ||
                                          mediaItem.mediaType.includes(
                                              "application"
                                          )
                                      ) {
                                          mediaType = "document";
                                      }
                                  }

                                  return {
                                      ...mediaItem,
                                      mediaType,
                                  };
                              }) || [];
                          
                          // Fetch user details from API if userId exists
                          let userDetails = {
                              name: post.userName || post.user?.name || "User",
                              profileImage: post.userProfileImage || post.user?.profileImage || "/person.png"
                          };
                          
                          if (post.userId) {
                              try {
                                  const userResponse = await fetch(`/api/proxy/user/${post.userId}`);
                                  if (userResponse.ok) {
                                      const userData = await userResponse.json();
                                      userDetails = {
                                          name: userData.fullName || userData.name || userDetails.name,
                                          profileImage: userData.image || userData.avatar || userDetails.profileImage
                                      };
                                      console.log(`Fetched user details for post ${post.postId || post.id}:`, userDetails);
                                  }
                              } catch (error) {
                                  console.warn(`Failed to fetch user details for user ID ${post.userId}:`, error);
                              }
                          }
                              
                          return {
                              id: post.postId || post.id,
                              userId: post.userId,
                              content: post.content,
                              // Keep the normalized media array for the UI components
                              media: normalizedMedia,
                              // For backward compatibility - get image from media if available
                              likes: post.voteCount || 0,
                              comments: post.commentCount || 0,
                              createdAt:
                                  post.postedAt ||
                                  post.createdAt ||
                                  new Date().toISOString(),
                              // Include additional details with fetched user info
                              user: userDetails.name,
                              avatar: userDetails.profileImage,
                              commentList: post.comments || [],
                              isLiked: post.isVotedByCurrentUser || false,
                          };
                      }))
                    : [];

                // Update the posts state based on whether we're appending or replacing
                setPosts((prevPosts) =>
                    shouldAppend
                        ? [...prevPosts, ...transformedPosts]
                        : transformedPosts
                );
            } catch (err) {
                console.error("Error fetching user posts:", err);
                setError(err.message || "Failed to fetch posts");
                setHasMore(false);
            } finally {
                setInitialLoading(false);
                setLoading(false);
            }
        },
        [validUserId, pageSize]
    );

    // Initial load - fetch first page when component mounts or when userId/pageSize/refreshTrigger changes
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, false);
    }, [validUserId, pageSize, refreshTrigger, fetchPosts]);

    // Function to load more posts (for infinite scrolling)
    const loadMorePosts = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, true);
        }
    }, [loading, hasMore, page, fetchPosts]);

    // Function to refresh posts
    const refreshPosts = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    return {
        posts,
        loading,
        initialLoading,
        error,
        hasMore,
        loadMorePosts,
        refreshPosts,
    };
}
