"use client";
// Remove Image and PostCard imports if no longer used directly here
// import Image from "next/image";
// import PostCard from "../feed/postCardWithMedia"; 
import { formatDistanceToNowStrict } from 'date-fns'; // Keep if used for anything else, or remove
import PendingPostItem from './PendingPostItem'; // Import the new component
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePendingGroupPosts } from "@/app/hooks/usePendingGroupPosts";

export default function GroupPendingPostsTab({ 
    groupId,
    handlePostApproval 
}) {
    // Use the hook directly in this component
    const {
        pendingPosts,
        isLoading,
        error,
        hasMore,
        loadMorePendingPosts: loadMorePosts,
        refreshPendingPosts: refreshPosts,
        removePostFromList
    } = usePendingGroupPosts(groupId);
    
    // Wrap the external handlePostApproval to also update local state
    const handlePostApprovalWithUI = async (postId, isApproved) => {
        // Call the parent component's handler
        await handlePostApproval(postId, isApproved);
        // Update the local UI state
        removePostFromList(postId);
    };
    // const isAdmin = groupAdmins?.includes(currentUserId); // This logic is now in page.js
    console.log("Pending posts:", pendingPosts);
    if (isLoading && pendingPosts.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow p-4 mt-4 text-center">
                <p className="text-red-500">Error loading pending posts: {error}</p>
                <button onClick={refreshPosts} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h2 className="text-lg font-semibold mb-4">
                Posts Pending Approval
            </h2>
            <InfiniteScroll
                dataLength={pendingPosts.length}
                next={loadMorePosts}
                hasMore={hasMore}
                loader={
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                }
                endMessage={
                    pendingPosts.length > 0 && (
                        <p className="text-center text-gray-500 py-4">
                            <b>No more pending posts.</b>
                        </p>
                    )
                }
                scrollableTarget="scrollableDiv" // Ensure your page layout has a scrollable container with this ID or adjust as needed
            >
                <div className="space-y-4">                    {pendingPosts.map((post) => (
                        <PendingPostItem 
                            key={post.id}
                            post={post} 
                            onApprove={(postId) => handlePostApprovalWithUI(postId, true)} 
                            onDeny={(postId) => handlePostApprovalWithUI(postId, false)}
                        />
                    ))}
                    {pendingPosts.length === 0 && !isLoading && (
                        <p className="text-gray-500 text-center py-4">
                            No posts currently pending approval.
                        </p>
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
}