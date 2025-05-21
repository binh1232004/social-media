"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { showToast } from "../../utils/toast";

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
            replies: []
        },
        { 
            id: 2,
            user: "Sarah Johnson", 
            text: "Love this!", 
            time: "30m ago",
            replies: [] 
        }
    ]);
    
    // State to track voting state changes after initial render
    const [voteState, setVoteState] = useState({
        isVoted: post.isLiked,
        count: post.likes
    });
    
    // Update local vote state when post prop changes
    useEffect(() => {
        setVoteState({
            isVoted: post.isLiked,
            count: post.likes
        });
    }, [post.isLiked, post.likes]);
    
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
    
    // Helper function to get file icon based on extension
    const getFileIcon = (fileName) => {
        if (!fileName) return '📎';
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            default:
                return '📎';
        }
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
    };    // Function to handle post voting via the API
    const handleVote = async (postId) => {
        // Track vote state before the API call
        const wasVoted = voteState.isVoted;
        
        // Update our local vote state (optimistic update)
        const newCount = wasVoted ? Math.max(0, voteState.count - 1) : voteState.count + 1;
        setVoteState({
            isVoted: !wasVoted,
            count: newCount
        });
        
        // Also update the global state via the provided onLike function
        onLike(postId);
        
        try {
            // Make API request to toggle the vote
            const response = await fetch(`/api/proxy/post-vote/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
              if (response.ok) {
                // Show success message
                const successText = wasVoted ? 'Vote removed' : 'Vote added';
                showToast(successText, 'success');
            } else {
                // If the request failed, parse the error and show a toast
                let errorMessage = 'Failed to process vote';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `Error ${response.status}`;
                } catch (parseError) {
                    errorMessage = `Server error (${response.status})`;
                }
                
                // Revert the optimistic update
                setVoteState({
                    isVoted: wasVoted,
                    count: wasVoted ? voteState.count + 1 : Math.max(0, voteState.count - 1)
                });
                
                // Also revert the global state
                onLike(postId);
                
                // Show appropriate error message
                if (response.status === 401) {
                    showToast('Please log in to vote', 'error');
                } else if (response.status === 403) {
                    showToast('You don\'t have permission to vote on this post', 'error');
                } else if (response.status === 404) {
                    showToast('This post no longer exists', 'error');
                } else {
                    showToast(errorMessage, 'error');
                }
                
                console.error('Vote operation failed:', errorMessage);
            }        } catch (error) {
            // If there's a network or other error, revert both local and global states
            setVoteState({
                isVoted: wasVoted,
                count: wasVoted ? voteState.count + 1 : Math.max(0, voteState.count - 1)
            });
            
            // Also revert the global state
            onLike(postId);
            
            showToast('Network error while processing vote', 'error');
            console.error('Error voting on post:', error);
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow p-5">
                      
            {/* Post header */}
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden relative">
                    <Image 
                        src={post.avatar || "/person.png"}
                        alt={post.user}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized={post.avatar && post.avatar.startsWith("blob:")}
                    />
                </div>
                <div>
                    <Link href={`/user/${post.userId}`}>
                        <h3 className="font-semibold hover:underline">{post.user}</h3>
                    </Link>
                    <div className="flex items-center">
                        <Link href={`/post/${post.id}`}>
                            <p className="text-xs text-gray-500 hover:underline">{post.time}</p>
                        </Link>
                        {post.location && (
                            <span className="text-xs text-gray-500 ml-2">• {post.location}</span>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Post content */}
            <div className="mb-4">
                <Link href={`/post/${post.id}`}>
                    <p className="mb-3 hover:text-blue-700 cursor-pointer">{post.content}</p>
                </Link>
                
                {/* Display tags if available */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                            <span 
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                  
                {/* Handle media array format with improved debugging */}
                {post.media && post.media.length > 0 && (
                    <div className="post-media-container">
                        {post.media.map((media, index) => {
                            // Debug output for problematic media items
                            if (!media.mediaUrl) {
                                console.warn('Media item missing URL:', media);
                                return null;
                            }

                            // Handle image media type
                            if (media.mediaType === 'image') {
                                return (
                                    <Link href={`/post/${post.id}`} key={index}>
                                        <div className="relative w-full h-auto rounded-lg overflow-hidden max-h-96 cursor-pointer mb-3">
                                            <Image 
                                                src={media.mediaUrl} 
                                                alt="Post image"
                                                width={600}
                                                height={400}
                                                className="w-full h-auto rounded-lg object-cover max-h-96 hover:opacity-95"
                                                unoptimized={media.mediaUrl.startsWith("blob:") || media.mediaUrl.startsWith("data:")}
                                            />
                                        </div>
                                    </Link>
                                );
                            } 
                            // Handle document media type
                            else if (media.mediaType === 'document') {
                                // Extract filename from URL for display
                                const fileName = media.mediaUrl.split('/').pop();
                                
                                // Determine the document type based on extension
                                let icon = '📄';
                                let documentType = 'Document';
                                
                                if (fileName) {
                                    const extension = fileName.split('.').pop().toLowerCase();
                                    
                                    if (extension === 'pdf') {
                                        icon = '📄';
                                        documentType = 'PDF Document';
                                    } else if (extension === 'doc' || extension === 'docx') {
                                        icon = '📝';
                                        documentType = 'Word Document';
                                    }
                                }
                                
                                return (
                                    <a 
                                        href={media.mediaUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        key={index}
                                        className="flex items-center p-4 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 border border-gray-300"
                                    >
                                        <span className="text-3xl mr-4">{icon}</span>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-medium text-blue-600 truncate">{fileName || 'Document'}</p>
                                            <p className="text-xs text-gray-500">{documentType} - Click to open</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                );
                            }
                            // Unknown media type - show generic entry
                            else {
                                return (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded mb-3 border border-gray-200">
                                        <span className="text-2xl mr-3">📎</span>
                                        <span className="text-sm text-gray-600">
                                            Attachment ({media.mediaType || 'unknown'})
                                            {media.mediaUrl && 
                                                <a 
                                                    href={media.mediaUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="ml-2 text-blue-500 hover:underline"
                                                >
                                                    Open
                                                </a>
                                            }
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
                
                {/* Backward compatibility for the legacy image format */}
                {!post.media && post.image && (
                    <Link href={`/post/${post.id}`}>
                        <div className="relative w-full h-auto rounded-lg overflow-hidden max-h-96 cursor-pointer">
                            <Image 
                                src={post.image} 
                                alt="Post content" 
                                width={600}
                                height={400}
                                className="w-full h-auto rounded-lg object-cover max-h-96 hover:opacity-95"
                                unoptimized={post.image.startsWith("blob:") || post.image.startsWith("data:")}
                            />
                        </div>
                    </Link>
                )}
            </div>            {/* Post stats */}
            <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div>
                    <span className={`inline-block mr-1 ${voteState.isVoted ? 'text-blue-500' : ''}`}>⬆️</span>
                    {voteState.count} {voteState.count === 1 ? 'vote' : 'votes'}
                </div>
                <div>
                    <span className="inline-block mr-1">💬</span>
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </div>
            </div>
            
            {/* Post actions */}
            <div className="flex border-t border-b py-2 mb-3">                <button 
                    onClick={() => handleVote(post.id)}
                    className={`flex-1 flex items-center justify-center py-2 hover:bg-gray-100 rounded-lg ${voteState.isVoted ? 'text-blue-500 font-medium' : ''}`}
                    aria-label={voteState.isVoted ? 'Remove vote' : 'Vote for this post'}
                >
                    <span className="mr-2" role="img" aria-label="vote">
                        {voteState.isVoted ? '⬆️' : '👍'}
                    </span> 
                    {voteState.isVoted ? 'Voted' : 'Vote'}
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
