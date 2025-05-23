"use client";
// Remove Image and PostCard imports if no longer used directly here
// import Image from "next/image";
// import PostCard from "../feed/postCardWithMedia"; 
import { formatDistanceToNowStrict } from 'date-fns'; // Keep if used for anything else, or remove
import PendingPostItem from './PendingPostItem'; // Import the new component

export default function GroupPendingPostsTab({ pendingPosts, handlePostApproval, currentUserId, groupAdmins }) {
    const isAdmin = groupAdmins?.includes(currentUserId);
    console.log(pendingPosts) 

    // Ensure handlePostApproval is correctly passed and used by PendingPostItem
    // The onApprove and onDeny props in PendingPostItem will call this function.

    return (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
            <h2 className="text-lg font-semibold mb-4">
                Posts Pending Approval
            </h2>
            <div className="space-y-4">
                {pendingPosts.map((post) => (
                    <PendingPostItem 
                        key={post.id}
                        post={post} 
                        onApprove={(postId) => handlePostApproval(postId, true)} 
                        onDeny={(postId) => handlePostApproval(postId, false)}
                    />
                ))}
                {pendingPosts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                        No posts pending approval
                    </p>
                )}
            </div>
        </div>
    );
}