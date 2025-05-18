"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FeedSection from "../../components/feed/feedSection";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileTabs from "../../components/profile/profileTabs";
import Image from "next/image";
import useUserProfile from "../../hooks/useUserProfile";
import useUserPosts from "../../hooks/useUserPosts";

export default function UserPage() {
  const params = useParams();
  const userId = params.id;
  
  // Fetch real user data using our custom hooks
  const { 
    profileData, 
    loading: profileLoading, 
    error: profileError 
  } = useUserProfile(userId);
  
  const { 
    posts: userPosts, 
    loading: postsLoading 
  } = useUserPosts(userId);
  
  const [activeTab, setActiveTab] = useState("posts");
  
  // Check if we're viewing our own profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Check if this is the current user's profile
  useEffect(() => {
    if (profileData) {
      // You could compare with the current user's ID from auth
      // For now, we'll assume it's not our profile
      setIsOwnProfile(false);
    }
  }, [profileData]);
  // Show loading state while data is being fetched
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show error if any
  if (profileError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-4 rounded-md border border-red-200 max-w-md">
          <h3 className="text-red-800 font-medium">Error loading profile</h3>
          <p className="text-red-600 mt-2">{profileError}</p>
        </div>
      </div>
    );
  }

  // Only render the main content when we have profile data
  if (!profileData) {
    return null;
  }

  return (
    <>
      <ProfileHeader profileData={profileData} isOwnProfile={isOwnProfile} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "posts" && (
        <FeedSection posts={userPosts} loading={postsLoading} />
      )}
      
      {activeTab === "about" && (
        <AboutSection profileData={profileData} />
      )}
      
      {activeTab === "friends" && (
        <FriendsSection userId={userId} />
      )}
    </>
  );
}

function AboutSection({ profileData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-500 font-medium">Bio</h3>
          <p>{profileData.bio}</p>
        </div>
        <div>
          <h3 className="text-gray-500 font-medium">Location</h3>
          <p>{profileData.location}</p>
        </div>
        <div>
          <h3 className="text-gray-500 font-medium">Joined</h3>
          <p>{profileData.joinedDate}</p>
        </div>
      </div>
    </div>
  );
}

function FriendsSection({ userId }) {
  const [friends, setFriends] = useState([
    { id: 1, name: "Jane Smith", avatar: "/person.png", mutualFriends: 12 },
    { id: 2, name: "Mike Johnson", avatar: "/person.png", mutualFriends: 8 },
    { id: 3, name: "Sarah Williams", avatar: "/person.png", mutualFriends: 5 },
  ]);

  // TODO: In future, fetch real friends data from API endpoint
  // For example: useEffect(() => { fetchFriendsList(userId) }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <span className="text-gray-500">{friends.length} friends</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map(friend => (
          <div key={friend.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
            <Image 
              src={friend.avatar} 
              alt={friend.name} 
              width={40}
              height={40}
              className="rounded-full mr-3" 
            />
            <div>
              <h3 className="font-medium">{friend.name}</h3>
              <p className="text-sm text-gray-500">{friend.mutualFriends} mutual friends</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
