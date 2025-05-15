"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../public/navbar";
import useUserSuggestions from "../hooks/useUserSuggestions";
import axios from "axios";
import { getAuthToken } from "../utils/auth";
import UserSuggestionCard from "../components/friends/UserSuggestionCard";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [existingFriends, setExistingFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friendError, setFriendError] = useState(null);
  
  // Get user suggestions from our hook
  const { 
    suggestions, 
    loading: suggestionsLoading, 
    error: suggestionsError,
    refreshSuggestions 
  } = useUserSuggestions(10);
  // Fetch existing friends when component mounts
  const handleAddFriend = async (userId) => {
  };

  const filteredFriends = existingFriends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <NavBar />
      <div className="max-w-6xl mx-auto pt-20 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Find Friends</h1>
<div className="relative mb-8">
        {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for friends..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Image
              src="/search.png"
              alt="Search"
              width={20}
              height={20}
            />
          </div>
        </div>
        
        {/* User Suggestions Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">People You May Know</h2>
            <button 
              onClick={refreshSuggestions}
              disabled={suggestionsLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
          
          {suggestionsLoading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {suggestionsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {suggestionsError}
            </div>
          )}
          
          {!suggestionsLoading && !suggestionsError && suggestions.length === 0 && (
            <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">No suggestions available right now</p>
            </div>
          )}
            {!suggestionsLoading && suggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map(user => (
                <UserSuggestionCard 
                  key={user.id} 
                  user={user} 
                  onFollowToggle={(userId, isFollowing) => {
                    handleAddFriend(userId);
                  }}
                />
              ))}
            </div>
          )}
        </section>
        
        

        
      </div>
    </>  );
}
