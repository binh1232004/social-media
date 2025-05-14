"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import FeedSection from "../../components/feed/feedSection";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileTabs from "../../components/profile/profileTabs";

export default function UserPage() {
  const params = useParams();
  const userId = parseInt(params.id);

  const [userData, setUserData] = useState({
    id: userId,
    name: "John Doe",
    avatar: "/person.png",
    coverPhoto: "https://source.unsplash.com/random/1200x300/?nature",
    bio: "Software developer passionate about creating amazing user experiences",
    location: "San Francisco, CA",
    joinedDate: "January 2022",
    friendCount: 420,
    postCount: 150
  });

  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      user: userData.name,
      avatar: userData.avatar,
      content: "Working on an exciting new project! #coding #development",
      likes: 89,
      comments: 12,
      time: "2 days ago"
    },
    {
      id: 2,
      user: userData.name,
      avatar: userData.avatar,
      content: "Just learned something new about React!",
      likes: 45,
      comments: 5,
      time: "1 week ago"
    }
  ]);

  const [activeTab, setActiveTab] = useState("posts");

  // In a real application, you would fetch user data here
  useEffect(() => {
    // Fetch user data based on userId
    // For now using dummy data
  }, [userId]);

  return (
    <>
      <ProfileHeader profileData={userData} isOwnProfile={false} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "posts" && (
        <FeedSection posts={userPosts} />
      )}
      
      {activeTab === "about" && (
        <AboutSection profileData={userData} />
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

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Friends</h2>
        <span className="text-gray-500">{friends.length} friends</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map(friend => (
          <div key={friend.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
            <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full mr-3" />
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
