"use client";
import React, { useState } from "react";

export default function ProfileHeader({ profileData, isOwnProfile = false }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Cover photo */}
      <div className="h-48 md:h-64 relative">
        <img 
          src={profileData.coverPhoto} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 flex items-center bg-white bg-opacity-80 hover:bg-opacity-100 px-3 py-1.5 rounded-md transition">
            <span className="mr-1">📷</span> Edit Cover Photo
          </button>
        )}
      </div>
      
      {/* Profile details section */}
      <div className="relative px-4 py-5 md:px-6">
        {/* Profile picture */}
        <div className="absolute -top-16 left-4 md:left-6 border-4 border-white rounded-full">
          <img 
            src={profileData.avatar} 
            alt={profileData.name} 
            className="w-28 h-28 rounded-full object-cover"
          />
        </div>
        
        <div className="ml-32 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-gray-500">@{profileData.username}</p>
          </div>
          
          <div className="flex space-x-2 mt-3 md:mt-0">
            {isOwnProfile ? (
              <button 
                className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1.5"
              >
                <span className="mr-1">✏️</span> Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsFriend(!isFriend)}
                  className={`flex items-center rounded-md px-3 py-1.5 ${
                    isFriend 
                      ? "bg-gray-200 hover:bg-gray-300" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <span className="mr-1">{isFriend ? "✓" : "+"}</span>
                  {isFriend ? "Friends" : "Add Friend"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
