"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import FeedSection from "../components/feed/feedSection";
import useUserPosts from "../hooks/useUserPosts";
import { getUserInfo, isAuthenticated } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    
    // Get user info safely with optional chaining
    const userInfo = getUserInfo();
    const userId = userInfo?.userId || null;
    
    // Check authentication on component mount
    useEffect(() => {
        if (!isAuthenticated() || !userId) {
            console.log("User not authenticated or missing userId, redirecting to signin");
            router.push("/signin");
            return;
        }
        setIsLoading(false);
    }, [router, userId]);
    
    // Use the custom hook to fetch posts for the current user with infinite scrolling
    const { 
        posts, 
        initialLoading, 
        loading, 
        error, 
        hasMore, 
        loadMorePosts, 
        refreshPosts 
    } = useUserPosts(userId || 'guest', 10); // Fallback to 'guest' if userId is null
    
    // Create an observer for infinite scrolling
    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts();
            }
        }, { threshold: 0.5 });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadMorePosts]);
    
    // Show loading state when checking authentication
    if (isLoading || !userId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    // Format posts for the FeedSection component with detailed information
    const formattedPosts = posts.map((post, index) => ({
        id: post.id,
        user: post.user || "User",
        avatar: post.avatar || "/person.png",
        content: post.content,
        media: post.media || [],
        likes: post.likes || 0,
        comments: post.comments || 0,
        time: formatTimeAgo(post.createdAt),
        // Include additional detailed fields
        commentList: post.commentList || [],
        isLiked: post.isLiked || false,
        userId: post.userId,
        // Add a ref to the last element for intersection observer
        ref: index === posts.length - 1 ? lastPostElementRef : null
    }));
    
    /**
     * Helper function to format the post date as relative time (e.g. "2 hours ago")
     */
    function formatTimeAgo(dateString) {
        if (!dateString) return "Recently";
        
        const postDate = new Date(dateString);
        const now = new Date();
        const diffTime = now - postDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
            }
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const diffWeeks = Math.floor(diffDays / 7);
            return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
        }
        return postDate.toLocaleDateString();
    }

    return (
        <>
            <FeedSection 
                posts={formattedPosts} 
                loading={initialLoading} 
                refreshPosts={refreshPosts}
            />
            
            {/* Loading indicator for infinite scrolling */}
            {loading && !initialLoading && (
                <div className="flex justify-center py-4 mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
              {/* End of posts message */}
            {!hasMore && posts.length > 0 && (
                <div className="text-center py-4 text-gray-500">
                    You&apos;ve reached the end of the feed
                </div>
            )}
              {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}
        </>
    );
}
