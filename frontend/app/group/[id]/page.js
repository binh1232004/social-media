"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGroupDetails } from "../../hooks/useGroupDetails";
import { useGroupPosts } from "../../hooks/useGroupPosts";
import { usePendingGroupPosts } from "../../hooks/usePendingGroupPosts"; // Import the real data hook
import { showToast } from "../../utils/toast";

// Import our component files
import GroupHeader from "../../components/groups/groupHeader";
import GroupDiscussionTab from "../../components/groups/groupDiscussionTab";
import GroupMembersTab from "../../components/groups/groupMembersTab";
import GroupAboutTab from "../../components/groups/groupAboutTab";
import GroupPendingPostsTab from "../../components/groups/groupPendingPostsTab";
import GroupReport from "../../components/groups/groupReport";

export default function GroupPage() {
    const params = useParams();
    const groupId = params.id;
    // State variables
    const [activeTab, setActiveTab] = useState("discussion");
    const [isMember, setIsMember] = useState(false);
    const [canViewContent, setCanViewContent] = useState(false);
    const {
        posts,
        isLoading: postsLoading,
        error: postsError,
        hasMore,
        loadMorePosts,
        refreshPosts
    } = useGroupPosts(groupId);
    console.log("Posts:", posts); 
    // Use our custom hook to fetch group details
    const {
        groupDetails,
        isLoading,
        error,
        isJoining,
        fetchGroupDetails,
        joinPublicGroup,
    } = useGroupDetails({
        groupId,
        onSuccess: (data) => {
            console.log("Group details loaded successfully:", data);
            // Determine if user can view content based on group visibility
            setCanViewContent(
                data.visibility.toLowerCase() === "public" || isMember
            );
        },        onError: (err) => {
            showToast("Failed to load group details", "error");
            console.error("Error loading group details:", err);
        },
    });
    
    // Use the real hook for pending posts
    const {
        pendingPosts,
        isLoading: pendingPostsLoading,
        error: pendingPostsError,
        hasMore: hasMorePending,
        loadMorePendingPosts,
        refreshPendingPosts,
        removePostFromList
    } = usePendingGroupPosts(groupId);

    useEffect(() => {
        const fetchToIsMember = async () => {
            try{
                const request = await fetch(`/api/proxy/group-user/${groupId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await request.json();
                console.log("User membership status:", data);
                setIsMember(data);
            }catch (error) {
                console.error("Error fetching group user data:", error);
            }
        }
        fetchToIsMember();
    }, [groupId]);
    
 
    
    // Function to handle joining a public group
    const handleJoinPublicGroup = async () => {
        try {
            // Set loading state
            showToast("Đang xử lý yêu cầu tham gia...", "info");
            const result = await joinPublicGroup(groupId);

            if (result) {
                setIsMember(true);
                setCanViewContent(true);
                // Show success message to the user
                showToast("Bạn đã tham gia nhóm thành công!", "success");
                // Refresh the group details
                await fetchGroupDetails(groupId, true);
            }
        } catch (error) {
            console.error("Error joining group:", error);
            showToast("Không thể tham gia nhóm, vui lòng thử lại", "error");
        }
    };
    
    // Function to handle joining a private group (for future implementation)
    const handleJoinPrivateGroup = () => {
        showToast("Tính năng tham gia nhóm riêng tư sẽ sớm ra mắt", "info");
    };
      // Function to handle post approval
    const handlePostApproval = async (postId, isApproved) => {
        try {
            // Show loading toast
            showToast(`Đang ${isApproved ? 'chấp nhận' : 'từ chối'} bài viết...`, 'info');
            
            // Call our proxy API endpoint
            const response = await fetch('/api/proxy/group-posts/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    postId,
                    approve: isApproved
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${isApproved ? 'approve' : 'reject'} post`);
            }
            
            // Success! Update UI and show success toast
            showToast(`Bài viết đã được ${isApproved ? 'chấp nhận' : 'từ chối'}`, 'success');
            removePostFromList(postId); // Remove from UI list using the hook function
        } catch (error) {
            console.error(`Error ${isApproved ? 'approving' : 'denying'} post:`, error);
            showToast(`Không thể ${isApproved ? 'chấp nhận' : 'từ chối'} bài viết, vui lòng thử lại`, "error");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !groupDetails) {
        return (
            <div className="bg-white rounded-lg shadow p-8 mt-4 text-center">
                <div className="text-red-500 mb-4">
                    <p className="mb-2">Error loading group details</p>
                    <p>{error || "Group not found"}</p>
                </div>
                <button
                    onClick={() => fetchGroupDetails(groupId, true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Group Header Component */}
            <GroupHeader 
                groupDetails={groupDetails}
                isMember={isMember}
                isJoining={isJoining}
                handleJoinPublicGroup={handleJoinPublicGroup}
                handleJoinPrivateGroup={handleJoinPrivateGroup}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {/* Tab Content */}
            {!canViewContent && groupDetails.visibility.toLowerCase() === "private" ? (
                <div className="bg-white rounded-lg shadow p-8 mt-4 text-center">
                    <div className="text-gray-500 mb-4">
                        <p className="mb-2">This is a private group.</p>
                        <p>You need to be a member to view its content.</p>
                    </div>
                    <button
                        onClick={handleJoinPrivateGroup}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                        Request to Join Group
                    </button>
                </div>
            ) : (
                <>                    {/* Discussion Tab */}
                    {activeTab === "discussion" && (
                        <GroupDiscussionTab 
                            isMember={isMember} 
                            posts={posts} 
                            setIsMember={setIsMember}
                            loading={postsLoading}
                            refreshPosts={refreshPosts}
                            groupId={groupId}
                        />
                    )}
                    
                    {/* Members Tab */}
                    {activeTab === "members" && (
                        <GroupMembersTab groupDetails={groupDetails} />
                    )}
                    
                    {/* About Tab */}
                    {activeTab === "about" && (
                        <GroupAboutTab groupDetails={groupDetails} />
                    )}
                    
                    {/* Pending Posts Tab - Only show if user is admin */}
                    {activeTab === "pendingPosts"  && (
                        <GroupPendingPostsTab 
                            pendingPosts={pendingPosts}
                            handlePostApproval={handlePostApproval}
                            isLoading={pendingPostsLoading}
                            error={pendingPostsError}
                            hasMore={hasMorePending}
                            loadMorePosts={loadMorePendingPosts}
                            refreshPosts={refreshPendingPosts}
                        />
                    )}
                    
                    {/* Report Tab */}
                    {activeTab === "report" && (
                        <GroupReport
                            group={groupDetails}
                            posts={posts}
                            pendingPosts={pendingPosts}
                        />
                    )}
                </>
            )}
        </>
    );
}
