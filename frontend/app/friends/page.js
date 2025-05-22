"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../public/navbar";
import useUserSuggestions from "../hooks/useUserSuggestions";
import useUserSearch from "../hooks/useUserSearch";
import axios from "axios";
import { getAuthToken } from "../utils/auth";
import UserSuggestionCard from "../components/friends/UserSuggestionCard";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [existingFriends, setExistingFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friendError, setFriendError] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // 'suggestions' or 'search'
  
  // Get user suggestions from our hook
  const { 
    suggestions, 
  loading: suggestionsLoading, 
    error: suggestionsError,
    refreshSuggestions 
  } = useUserSuggestions(10);
  
  // User search functionality
  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    hasMore,
    searchUsers,
    loadMore,
    resetSearch
  } = useUserSearch(20);

  // Handle search input changes with debounce
  const debounceTimeout = React.useRef(null);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Set active tab to search when typing
    if (value.trim()) {
      setActiveTab('search');
    } else {
      setActiveTab('suggestions');
    }
    
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set a new timeout to execute search after typing stops
    debounceTimeout.current = setTimeout(() => {
      if (value.trim()) {
        searchUsers(value);
      } else {
        resetSearch();
      }
    }, 500); // 500ms debounce delay
  };
  
  // Refresh both suggestions and search results
  const handleRefresh = () => {
    if (activeTab === 'search' && searchQuery.trim()) {
      searchUsers(searchQuery);
    } else {
      refreshSuggestions();
    }
  };
  
  // Fetch existing friends when component mounts
  const handleAddFriend = async (userId) => {
    try {
      // Use our proxy API endpoint for follow/unfollow
      await axios.post(`/api/proxy/follow/${userId}`);
      
      // Refresh data after action
      handleRefresh();
    } catch (error) {
      console.error('Failed to update friend status:', error);
      alert('Failed to update friend status. Please try again.');
    }
  };

  const filteredFriends = existingFriends.filter(user =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <NavBar />      <div className="max-w-6xl mx-auto pt-20 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Find Friends</h1>
        <div className="relative mb-8">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
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
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {/* <button
            onClick={() => setActiveTab('suggestions')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'suggestions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Suggestions
          </button> */}
          <button
            onClick={() => {
              setActiveTab('search');
              if (searchQuery) searchUsers(searchQuery);
            }}
            className={`py-2 px-4 font-medium ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search Results
          </button>
        </div>
        
        {/* User Suggestions Section - only show when activeTab is 'suggestions' */}
        {/* {activeTab === 'suggestions' && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">People You May Know</h2>
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
            </div>          )}
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
        )} */}

        {/* Search Results Section - only show when activeTab is 'search' */}
        {activeTab === 'search' && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchQuery.trim() && (
                <button 
                  onClick={() => searchUsers(searchQuery)}
                  disabled={searchLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </button>
              )}
            </div>
            
            {searchLoading && (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {searchError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {searchError}
              </div>
            )}
            
            {!searchLoading && !searchError && searchQuery.trim() && searchResults.length === 0 && (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">No users found matching "{searchQuery}"</p>
              </div>
            )}
            
            {!searchQuery.trim() && (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Enter a name to search for users</p>
              </div>
            )}
            
            {!searchLoading && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(user => (
                  <UserSuggestionCard 
                    key={user.userId} 
                    user={{
                      id: user.userId,
                      fullName: user.fullName,
                      username: user.username,
                      image: user.image
                    }} 
                    onFollowToggle={(userId, isFollowing) => {
                      handleAddFriend(userId);
                    }}
                  />
                ))}
              </div>
            )}
            
            {!searchLoading && searchResults.length > 0 && hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => loadMore(searchQuery)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
