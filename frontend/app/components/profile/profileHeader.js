"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ProfileHeader({ profileData, isOwnProfile = false }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  
  if (!profileData) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Simplified header without cover photo */}
      <div className="px-4 py-8 md:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        {/* Profile details section */}
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Profile picture */}
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <Image 
              src={profileData.avatar || '/avatar.png'} 
              alt={profileData.name || "User profile"} 
              width={96}
              height={96}
              className="rounded-full border-4 border-white shadow-md"
              priority
            />
          </div>
          
          <div className="flex flex-col md:flex-row flex-grow justify-between items-center md:items-start">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-gray-500">@{profileData.username}</p>
              {profileData.bio && (
                <p className="text-gray-600 mt-2 max-w-md">{profileData.bio}</p>
              )}
            </div>
            
            <div className="flex space-x-2">
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
    </div>
  );
}
