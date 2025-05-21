"use client";
import React, { useState, useEffect } from "react";
import PostCard from "./postCardWithMedia"; // Use the enhanced PostCard with media support
import CreatePost from "./createPost";

export default function FeedSection({ posts = [], loading = false, refreshPosts }) {
    const [feedPosts, setFeedPosts] = useState(posts);
    
    // Update feedPosts when posts prop changes
    useEffect(() => {
        if (posts) {
            setFeedPosts(posts);
        }
    }, [posts]);
    
    const addNewPost = (postData) => {
        // Format the API response to match our feed post structure
        const newPost = {
            id: postData.id || `temp-${Date.now()}`,
            user: postData.user?.name || "You",
            userId: postData.user?.id || postData.userId,
            avatar: postData.user?.profileImage || "/person.png",
            content: postData.content,
            // Handle media from API response
            media: postData.media || [],
            likes: 0,
            comments: 0,
            time: "Just now",
            createdAt: postData.createdAt || new Date().toISOString()
        };
        
        setFeedPosts([newPost, ...feedPosts]);
    };
      const handleLike = (postId) => {
        setFeedPosts(feedPosts.map(post => {
            if (post.id === postId) {
                // Toggle isLiked status and update likes count
                const newIsLiked = !post.isLiked;
                const newLikes = newIsLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
                return {...post, isLiked: newIsLiked, likes: newLikes};
            }
            return post;
        }));
    };
    
    return (
        <div className="space-y-6 mt-3">
            <CreatePost onPostCreated={addNewPost} refreshPosts={refreshPosts} /> 
            
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : feedPosts && feedPosts.length > 0 ? (
                feedPosts.map(post => (
                    <div key={post.id} ref={post.ref || null}>
                        <PostCard 
                            post={post}
                            onLike={handleLike}
                        />
                    </div>
                ))
            ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No posts to display</p>
                </div>
            )}
        </div>
    );
}