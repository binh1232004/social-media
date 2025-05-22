"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import usePost from "../../hooks/usePost";
import PostCard from "../../components/feed/postCardWithMedia";
import Link from "next/link";

/**
 * Format a date string as relative time (e.g. "2 hours ago")
 * @param {string} dateString - ISO date string to format
 * @returns {string} - Formatted relative time string
 */
function formatTimeAgo(dateString) {
    if (!dateString) return "Recently";
    
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
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]}`;
}

export default function PostPage() {
    const params = useParams();
    const postId = params.id;
    
    const { post, loading, error, refreshPost } = usePost(postId);
      // Handle like action
    const handleLike = (id) => {
        // Update the post state with toggled like status
        if (post) {
            const newIsLiked = !post.isLiked;
            const newLikes = newIsLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
            
            refreshPost({
                ...post,
                isLiked: newIsLiked,
                likes: newLikes
            });
        }
        // Log the action
        console.log(`Toggled like on post with ID: ${id}`);
    };
      // Format post for the PostCard component if available
    const formattedPost = post ? {
        id: post.id,
        user: post.user || "User",
        avatar: post.avatar || "/person.png",
        content: post.content,
        image: post.image,
        likes: post.likes || 0,
        comments: post.comments || 0,
        time: formatTimeAgo(post.createdAt),
        // Include additional detailed information
        userId: post.userId,
        isLiked: post.isLiked || false,
        commentList: post.commentList || [],
        tags: post.tags || [],
        location: post.location || null,
        shareCount: post.shareCount || 0
    } : null;
    
    return (
        <div className="max-w-2xl mx-auto mt-8 px-4">
            <Link href="/home" className="inline-block mb-6 text-blue-500 hover:text-blue-700">
                &larr; Back to feed
            </Link>
            
            {loading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            ) : formattedPost ? (
                <PostCard post={formattedPost} onLike={handleLike} />
            ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p>Post not found</p>
                </div>
            )}
        </div>
    );
}
