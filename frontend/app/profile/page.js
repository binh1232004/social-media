"use client";
import React, { useState } from "react";
import FeedSection from "../components/feed/feedSection";
import ProfileHeader from "../components/profile/profileHeader";
import ProfileTabs from "../components/profile/profileTabs";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    username: "johndoe",
    avatar: "/person.png",
    coverPhoto: "https://source.unsplash.com/random/1200x300/?landscape",
    bio: "Software Developer | Photography Enthusiast | Coffee Lover",
    location: "San Francisco, CA",
    followers: 1234,
    following: 567,
    joinedDate: "January 2020"
  });

  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      user: profileData.name,
      avatar: profileData.avatar,
      content: "Just launched my new portfolio website! Check it out and let me know what you think.",
      image: "https://source.unsplash.com/random/600x400/?website",
      likes: 89,
      comments: 12,
      time: "3 days ago"
    },
    {
      id: 2,
      user: profileData.name,
      avatar: profileData.avatar,
      content: "Beautiful sunset at the beach today! 🌅",
      image: "https://source.unsplash.com/random/600x400/?sunset,beach",
      likes: 142,
      comments: 24,
      time: "1 week ago"
    },
    {
      id: 3,
      user: profileData.name,
      avatar: profileData.avatar,
      content: "Had an amazing time at the tech conference this weekend. Met so many inspiring people!",
      likes: 67,
      comments: 8,
      time: "2 weeks ago"
    }
  ]);

  const [activeTab, setActiveTab] = useState("posts");

  return (
    <>      <ProfileHeader profileData={profileData} isOwnProfile={true} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === "posts" && (
        <FeedSection posts={userPosts} />
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

function PhotosSection() {
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
          <div key={index} className="aspect-square overflow-hidden rounded-lg">
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}