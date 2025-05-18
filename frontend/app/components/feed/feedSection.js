"use client";
import React, { useState, useEffect } from "react";
import PostCard from "./postCard";
import CreatePost from "./createPost";

export default function FeedSection({ posts = [], loading = false }) {
    const [feedPosts, setFeedPosts] = useState(posts);
    
    // Update feedPosts when posts prop changes
    useEffect(() => {
        if (posts) {
            setFeedPosts(posts);
        }
    }, [posts]);
    
    const addNewPost = (post) => {
        const newPost = {
            id: feedPosts.length + 1,
            user: "You",
            avatar: "/person.png",
            content: post.content,
            image: post.image,
            likes: 0,
            comments: 0,
            time: "Just now"
        };
        
        setFeedPosts([newPost, ...feedPosts]);
    };
    
    const handleLike = (postId) => {
        setFeedPosts(feedPosts.map(post => 
            post.id === postId ? {...post, likes: post.likes + 1} : post
        ));
    };
    
    return (
        <div className="space-y-6 mt-3">
            <CreatePost onPostCreated={addNewPost} /> 
            
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : feedPosts && feedPosts.length > 0 ? (
                feedPosts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post}
                        onLike={handleLike}
                    />
                ))
            ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No posts to display</p>
                </div>
            )}
        </div>
    );
}