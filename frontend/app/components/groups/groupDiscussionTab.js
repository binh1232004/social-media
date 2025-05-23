"use client";
import React from "react";
import FeedSection from "@/app/components/feed/feedSection";
import PostCard from "@/app/components/feed/postCardWithMedia";
import GroupCreatePost from "@/app/components/groups/groupCreatePost";
import { showToast } from "@/app/utils/toast";
import { useGroupPosts } from "@/app/hooks/useGroupPosts";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function GroupDiscussionTab({ 
    isMember, 
    groupId
}) {
    // Use the hook directly in this component
    const {
        posts,
        isLoading: loading,
        error,
        hasMore,
        loadMorePosts,
        refreshPosts
    } = useGroupPosts(groupId);

    // Format posts to ensure media properties match what PostCard expects
    const formattedPosts = Array.isArray(posts) ? posts.map(post => {
        // Create a new post object with the correct structure
        const formattedPost = { ...post };
        
        // Format media items if they exist
        if (post.media && Array.isArray(post.media)) {
            formattedPost.media = post.media.map(item => {
                // Make sure each media item has mediaType and mediaUrl properties
                if (!item.mediaType && item.type) {
                    // If type exists but mediaType doesn't, copy it
                    return { 
                        mediaType: item.type,
                        mediaUrl: item.url || item.mediaUrl || '',
                    };
                } else if (!item.mediaUrl && item.url) {
                    // If url exists but mediaUrl doesn't, copy it
                    return {
                        mediaType: item.mediaType || item.type || 'unknown',
                        mediaUrl: item.url,
                    };
                }
                // Return the item if it already has the correct properties
                return item;
            });
        } else if (post.image) {
            // Convert legacy image format to media array
            formattedPost.media = [{
                mediaType: 'image',
                mediaUrl: post.image
            }];
        }
        
        return formattedPost;
    }) : [];
    
    console.log("Formatted posts:", formattedPosts);
    
    const handleAddNewPost = (postData) => {
        if (refreshPosts) {
            refreshPosts();
        }
    };
    
    return (
        <div>
            {isMember ? (
                <>                    {/* GroupCreatePost component for members only */}
                    <div className="mb-4">
                        <GroupCreatePost 
                            groupId={groupId}
                            onPostCreated={handleAddNewPost} 
                            refreshPosts={refreshPosts} 
                        />
                    </div>
                      <div className="mt-4">
                        {loading && formattedPosts.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : formattedPosts.length > 0 ? (
                            <InfiniteScroll
                                dataLength={formattedPosts.length}
                                next={loadMorePosts}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex justify-center py-4 my-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                }
                                endMessage={
                                    <p className="text-center text-gray-500 py-4">
                                        <b>You seen all posts in this group.</b>
                                    </p>
                                }
                            >
                                <div className="space-y-6">
                                    {formattedPosts.map((post) => (
                                        <div key={post.id}>
                                            <PostCard
                                                post={post}
                                                onLike={() => {}} // This would need to be implemented
                                            />
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">
                                    No posts available in this group.
                                </p>
                                <p className="mt-2 text-gray-600">
                                    Create a new post to get the discussion started!
                                </p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="space-y-6 mt-3">
                    {loading && formattedPosts.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>                    ) : formattedPosts.length > 0 ? (
                        formattedPosts.map((post) => (
                            <div key={post.id}>
                                <PostCard
                                    post={post}
                                    onLike={() => {}} // No-op function since non-members can't like
                                />
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">
                                No posts available in this group.
                            </p>
                            
                        </div>
                    )}                    
                    {/* Loading indicator */}
                    {loading && formattedPosts.length > 0 && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}