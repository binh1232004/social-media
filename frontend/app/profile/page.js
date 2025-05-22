"use client";
import React, { useState } from "react";
import Image from "next/image";
import FeedSection from "../components/feed/feedSection";
import ProfileHeader from "../components/profile/profileHeader";
import ProfileTabs from "../components/profile/profileTabs";
import Toast from "../components/ui/toast";
import useUserProfile from "../hooks/useUserProfile";
import useUserPosts from "../hooks/useUserPosts";
import { getUserInfo } from "../utils/auth";
export default function ProfilePage() {
  // Use the custom hooks to fetch real data
  const { userId } = getUserInfo();
  const { 
    profileData, 
    loading: profileLoading, 
    error: profileError,
    refreshProfile 
  } = useUserProfile(userId);
  const { posts: userPosts, loading: postsLoading } = useUserPosts(profileData?.userId);
  console.log("user posts", userPosts);  
  const [activeTab, setActiveTab] = useState("posts");
  const [toast, setToast] = useState(null);
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
  // Function to handle profile update success
  const handleProfileUpdate = () => {
    refreshProfile();
    setToast({
      message: 'Profile updated successfully!',
      type: 'success'
    });
  };
  
  return (
    <>    <ProfileHeader 
        profileData={profileData} 
        isOwnProfile={true} 
        onProfileUpdate={handleProfileUpdate} 
      />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "posts" && (
        <FeedSection posts={userPosts} loading={postsLoading} />
      )}
      
      {activeTab === "about" && (
        <AboutSection profileData={profileData} />
      )}
      
      {activeTab === "friends" && (
        <FriendsSection />
      )}
      
      {activeTab === "photos" && (
        <PhotosSection />
      )}
      
      {/* Show toast notification if it exists */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
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

function FriendsSection() {
  // We're keeping the mock friends data for now as mentioned in the conversation
  // This can be replaced later with real data from a friends API
  const friends = [
    { id: 1, name: "Jane Smith", avatar: "/person.png", mutualFriends: 12 },
    { id: 2, name: "Mike Johnson", avatar: "/person.png", mutualFriends: 8 },
    { id: 3, name: "Sarah Williams", avatar: "/person.png", mutualFriends: 5 },
    { id: 4, name: "Alex Brown", avatar: "/person.png", mutualFriends: 3 },
    { id: 5, name: "Emma Davis", avatar: "/person.png", mutualFriends: 15 },
    { id: 6, name: "Ryan Wilson", avatar: "/person.png", mutualFriends: 2 }
  ];
  
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

function PhotosSection() {
  // These are mock photos for now, to be replaced with real data
  const photos = [
    "https://source.unsplash.com/random/300x300/?nature",
    "https://source.unsplash.com/random/300x300/?city",
    "https://source.unsplash.com/random/300x300/?people",
    "https://source.unsplash.com/random/300x300/?technology",
    "https://source.unsplash.com/random/300x300/?food",
    "https://source.unsplash.com/random/300x300/?travel",
    "https://source.unsplash.com/random/300x300/?architecture",
    "https://source.unsplash.com/random/300x300/?animals",
    "https://source.unsplash.com/random/300x300/?sports"
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4">Photos</h2>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="aspect-square overflow-hidden rounded-lg relative">
            <Image 
              src={photo} 
              alt={`Photo ${index + 1}`} 
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}