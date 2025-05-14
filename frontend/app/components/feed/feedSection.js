"use client";
import React, { useState } from "react";
import PostCard from "./postCard";
import CreatePost from "./createPost";

export default function FeedSection({ posts }) {
    const [feedPosts, setFeedPosts] = useState(posts);
    
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
            
            {feedPosts.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post}
                    onLike={handleLike}
                />
            ))}
        </div>
    );
}