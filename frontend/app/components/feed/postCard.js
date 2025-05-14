"use client";
import React, { useState } from "react";

export default function PostCard({ post, onLike }) {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [comments, setComments] = useState([
        { 
            id: 1,
            user: "Alex Kim", 
            text: "Great post!", 
            time: "1h ago",
            replies: [
                { 
                    id: 3,
                    user: "Jane Smith", 
                    text: "I agree with you!", 
                    time: "45m ago",
                    replies: [
                        {
                            id: 5,
                            user: "Mike Johnson",
                            text: "I think so too! The details are amazing.",
                            time: "30m ago",
                            replies: [
                                {
                                    id: 7,
                                    user: "Alex Kim",
                                    text: "Thanks everyone for your support!",
                                    time: "20m ago",
                                    replies: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        { 
            id: 2,
            user: "Sarah Johnson", 
            text: "Love this!", 
            time: "30m ago",
            replies: [] 
        }
    ]);
    
    // Function to add a comment or reply at any nesting level
    const addNestedComment = (commentId, commentText, commentsArray) => {
        return commentsArray.map(c => {
            if (c.id === commentId) {
                // Found the target comment, add a reply
                return {
                    ...c,
                    replies: [
                        ...c.replies,
                        {
                            id: new Date().getTime(),
                            user: "You",
                            text: commentText,
                            time: "Just now",
                            replies: []
                        }
                    ]
                };
            } else if (c.replies && c.replies.length > 0) {
                // Search in replies recursively
                return {
                    ...c,
                    replies: addNestedComment(commentId, commentText, c.replies)
                };
            }
            return c;
        });
    };
    
    const handleAddComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            if (replyTo) {
                // Add reply to specific comment at any nesting level
                setComments(addNestedComment(replyTo.commentId, comment, comments));
                setReplyTo(null);
            } else {
                // Add new top-level comment
                setComments([...comments, {
                    id: new Date().getTime(),
                    user: "You",
                    text: comment,
                    time: "Just now",
                    replies: []
                }]);
            }
            setComment("");
        }
    };

    const handleReply = (commentId, userName) => {
        setReplyTo({ commentId, userName });
        setComment(`@${userName} `);
    };
    
    const cancelReply = () => {
        setReplyTo(null);
        setComment("");
    };
    
    // Recursive comment component for rendering comments at any nesting level
    const Comment = ({ comment, nestLevel = 0 }) => {
        const maxNestLevel = 5; // Maximum nesting level to prevent too deep nesting
        const currentNestLevel = Math.min(nestLevel, maxNestLevel);
        
        return (
            <div className="comment-thread">
                <div className="flex">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex-shrink-0"></div>
                    <div className="flex-1">
                        <div className="bg-gray-100 rounded-2xl py-2 px-3 max-w-[95%]">
                            <p className="font-semibold text-sm">{comment.user}</p>
                            <p>{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{comment.time}</p>
                        </div>
                        
                        <button 
                            onClick={() => handleReply(comment.id, comment.user)}
                            className="text-xs text-gray-500 mt-1 ml-2 hover:text-blue-500"
                        >
                            Reply
                        </button>
                    </div>
                </div>
                
                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-10 mt-2 space-y-3">
                        {comment.replies.map(reply => (
                            <Comment 
                                key={reply.id} 
                                comment={reply} 
                                nestLevel={currentNestLevel + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <div className="bg-white rounded-lg shadow p-5">
            {/* Post header */}
            <div className="flex items-center mb-4">
                <img 
                    src={post.avatar} 
                    alt={post.user}
                    className="w-10 h-10 rounded-full mr-3" 
                />
                <div>
                    <h3 className="font-semibold">{post.user}</h3>
                    <p className="text-xs text-gray-500">{post.time}</p>
                </div>
            </div>
            
            {/* Post content */}
            <div className="mb-4">
                <p className="mb-3">{post.content}</p>
                {post.image && (
                    <img 
                        src={post.image} 
                        alt="Post" 
                        className="w-full h-auto rounded-lg object-cover max-h-96" 
                    />
                )}
            </div>
            
            {/* Post stats */}
            <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div>{post.likes} likes</div>
                <div>
                    {countAllComments(comments)} comments
                </div>
            </div>
            
            {/* Post actions */}
            <div className="flex border-t border-b py-2 mb-3">
                <button 
                    onClick={() => onLike(post.id)} 
                    className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg"
                >
                    <span className="mr-2">👍</span> Like
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)} 
                    className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg"
                >
                    <span className="mr-2">💬</span> Comment
                </button>
                <button className="flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg">
                    <span className="mr-2">↗️</span> Share
                </button>
            </div>
            
            {/* Comments section */}
            {showComments && (
                <div>
                    <div className="mb-3 space-y-3">
                        {comments.map((topComment) => (
                            <Comment key={topComment.id} comment={topComment} />
                        ))}
                    </div>
                    
                    <form onSubmit={handleAddComment} className="flex flex-col">
                        {replyTo && (
                            <div className="bg-blue-50 px-3 py-1 mb-2 rounded flex justify-between items-center">
                                <span className="text-sm">
                                    Replying to <span className="font-medium">{replyTo.userName}</span>
                                </span>
                                <button 
                                    type="button"
                                    onClick={cancelReply}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        
                        <div className="flex">
                            <input
                                type="text"
                                placeholder={replyTo ? `Reply to ${replyTo.userName}...` : "Write a comment..."}
                                className="flex-1 rounded-full bg-gray-100 px-4 py-2 mr-2"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                autoFocus={!!replyTo}
                            />
                            <button 
                                type="submit" 
                                className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600"
                            >
                                {replyTo ? "Reply" : "Post"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

// Helper function to count all comments and replies recursively
function countAllComments(comments) {
    return comments.reduce((total, comment) => {
        // Count this comment
        let count = 1;
        
        // Count all its replies recursively
        if (comment.replies && comment.replies.length > 0) {
            count += countAllComments(comment.replies);
        }
        
        return total + count;
    }, 0);
}