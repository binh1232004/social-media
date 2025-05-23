"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileModal from "./editProfileModal";
import { useFollow } from "../../hooks/useFollow";
import { showToast } from "../../utils/toast";

export default function ProfileHeader({ profileData, isOwnProfile = false, onProfileUpdate }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { followUser, unfollowUser, checkFollowStatus, isLoading } = useFollow();
  
  useEffect(() => {
    // Check if the current user is following this profile when the component mounts
    const checkIfFollowing = async () => {
      if (!isOwnProfile && profileData && profileData.userId) {
        const followStatus = await checkFollowStatus(profileData.userId);
        console.log("Follow status:", followStatus);
        setIsFollowing(followStatus.isFollowing);
      }
    };
    
    checkIfFollowing();
  }, [profileData, isOwnProfile, checkFollowStatus]);
  
  if (!profileData) {
    return null;
  }
  
  const handleEditSuccess = () => {
    // Call the parent component's update function if provided
    if (typeof onProfileUpdate === 'function') {
      onProfileUpdate();
    }
  };
  
  const handleFollowToggle = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (isFollowing) {
        // Unfollow the user
        await unfollowUser(profileData.userId);
        setIsFollowing(false);
        showToast("Đã hủy theo dõi người dùng", "success");
      } else {
        // Follow the user
        await followUser(profileData.userId);
        setIsFollowing(true);
        showToast("Đã theo dõi người dùng", "success");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      showToast("Có lỗi xảy ra. Vui lòng thử lại sau.", "error");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Simplified header without cover photo */}
      <div className="px-4 py-8 md:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        {/* Profile details section */}
        <div className="flex flex-col md:flex-row items-center md:items-start">          {/* Profile picture */}
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-24 h-24 relative rounded-full border-4 border-white shadow-md overflow-hidden">
              <Image 
                src={profileData.avatar || '/avatar.png'} 
                alt={profileData.name || "User profile"} 
                fill
                sizes="96px"
                style={{ objectFit: 'cover' }}
                className="rounded-full"
                priority
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row flex-grow justify-between items-center md:items-start">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-gray-500">@{profileData.username}</p>
              {profileData.bio && (
                <p className="text-gray-600 mt-2 max-w-md">{profileData.bio}</p>
              )}
            </div>              <div className="flex space-x-2">
              {isOwnProfile ? (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1.5"
                >
                  <span className="mr-1">✏️</span> Chỉnh sửa
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={isProcessing}
                    className={`flex items-center rounded-md px-3 py-1.5 ${
                      isFollowing 
                        ? "bg-gray-200 hover:bg-gray-300" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-1">{isFollowing ? "✓" : "+"}</span>
                        {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        profileData={profileData} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
