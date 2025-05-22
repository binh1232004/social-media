"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../public/navbar";
import useUserSearch from "../hooks/useUserSearch";
import axios from "axios";
import { getAuthToken } from "../utils/auth";
import UserSuggestionCard from "../components/friends/UserSuggestionCard";

// Skeleton loading component for user cards
const UserCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
    <div className="flex justify-center -mt-10">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-20 w-20 border-4 border-white dark:border-gray-800"></div>
    </div>
    <div className="pt-12 pb-6 px-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-full w-32 mt-4"></div>
      </div>
    </div>
  </div>
);

export default function FriendsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [existingFriends, setExistingFriends] = useState([]);
    const [friendsLoading, setFriendsLoading] = useState(true);
    const [friendError, setFriendError] = useState(null);
    const [activeTab, setActiveTab] = useState("search");

    // User search functionality
    const {
        searchResults,
        loading: searchLoading,
        error: searchError,
        hasMore,
        searchUsers,
        loadMore,
        resetSearch,
    } = useUserSearch(20);

    // Handle search input changes with debounce
    const debounceTimeout = React.useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Set active tab to search when typing
        if (value.trim()) {
            setActiveTab("search");
        } else {
            setActiveTab("suggestions");
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
        if (activeTab === "search" && searchQuery.trim()) {
            searchUsers(searchQuery);
        }
    };

    // Handle add/follow friend
    const handleAddFriend = async (userId) => {
        try {
            // Use our proxy API endpoint for follow/unfollow
            await axios.post(`/api/proxy/follow/${userId}`);

            // Refresh data after action
            handleRefresh();
        } catch (error) {
            console.error("Failed to update friend status:", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="max-w-6xl mx-auto pt-24 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Header with enhanced gradient background and pattern */}
                    <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 px-6 py-10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                                <defs>
                                    <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <rect fill="none" width="10" height="10" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect fill="url(#gridPattern)" width="100" height="100" />
                                <path fill="white" d="M50,20 C55.5228475,20 60,24.4771525 60,30 C60,35.5228475 55.5228475,40 50,40 C44.4771525,40 40,35.5228475 40,30 C40,24.4771525 44.4771525,20 50,20 Z M30,70 C30,59.0294373 38.9543773,50.1 50,50.1 C61.0456227,50.1 70,59.0294373 70,70 L30,70 Z" />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                                Tìm kiếm bạn bè
                            </h1>
                            <p className="text-blue-100 opacity-90 max-w-2xl text-lg">
                                Kết nối với bạn bè và mở rộng mối quan hệ trong cộng đồng HCMUE
                            </p>
                        </div>
                    </div>
                    
                    <div className="px-6 py-8">
                        {/* Enhanced Search Bar with floating effect */}
                        <div className="mb-10 transition-all duration-300 group relative -mt-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-2xl blur-xl filter opacity-70 animate-pulse group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bạn bè theo tên hoặc username..."
                                    className="w-full pl-12 pr-12 py-4 border-0 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => {
                                            setSearchQuery('');
                                            resetSearch();
                                        }}
                                        className="absolute inset-y-0 right-4 flex items-center"
                                    >
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Tabs */}
                        <div className="flex mb-10 bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                            <button
                                onClick={() => {
                                    setActiveTab("search");
                                    if (searchQuery) searchUsers(searchQuery);
                                }}
                                className={`flex-1 py-3 px-4 text-center rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === "search"
                                        ? "bg-white dark:bg-gray-800 text-blue-600 shadow-md transform scale-105"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
                                    </svg>
                                    Kết quả tìm kiếm
                                </div>
                            </button>
                        </div>

                        {/* Search Results Section */}
                        <section className="mb-12 animate-fadeIn">
                            {/* Results Header */}
                            <div className="flex flex-wrap justify-between items-center mb-8">
                                <div className="flex items-center mb-4 sm:mb-0">                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {searchQuery.trim() 
                                            ? `Kết quả cho "${searchQuery}"` 
                                            : "Danh sách người dùng"}
                                    </h3>
                                    {searchResults.length > 0 && !searchLoading && (
                                        <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300 animate-fadeIn">
                                            {searchResults.length} kết quả
                                        </span>
                                    )}
                                </div>
                                
                                {searchQuery.trim() && (
                                    <button
                                        onClick={() => searchUsers(searchQuery)}
                                        disabled={searchLoading}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        <svg
                                            className={`w-4 h-4 mr-2 ${searchLoading ? 'animate-spin' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            ></path>
                                        </svg>
                                        Làm mới
                                    </button>
                                )}
                            </div>

                            {/* Skeleton Loading */}
                            {searchLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {[...Array(6)].map((_, i) => (
                                        <UserCardSkeleton key={i} />
                                    ))}
                                </div>
                            )}

                            {/* Error Display with improved styling */}
                            {searchError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-5 rounded-xl mb-8 flex items-start shadow-sm">
                                    <svg className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd"></path>
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-lg">Lỗi tìm kiếm</h3>
                                        <p className="mt-2">{searchError}</p>
                                        <button 
                                            onClick={() => searchUsers(searchQuery)}
                                            className="mt-3 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* No Results State */}
                            {!searchLoading &&
                                !searchError &&
                                searchQuery.trim() &&
                                searchResults.length === 0 && (
                                    <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 shadow-inner mb-8">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center transform hover:rotate-12 transition-transform">
                                            <svg
                                                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Không tìm thấy kết quả</h3>                                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                            Không có người dùng nào phù hợp với từ khóa &quot;<span className="font-medium text-gray-700 dark:text-gray-300">{searchQuery}</span>&quot;
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setSearchQuery('');
                                                resetSearch();
                                            }}
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-5 py-2 rounded-lg inline-flex items-center font-medium transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            Xóa tìm kiếm
                                        </button>
                                    </div>
                                )}

                            {/* Empty State - No Search Query */}
                            {!searchLoading && !searchError && !searchQuery.trim() && (
                                <div className="text-center py-16 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 shadow-inner mb-8 relative overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                            <g fill="currentColor">
                                                <circle cx="10" cy="10" r="2" />
                                                <circle cx="30" cy="10" r="2" />
                                                <circle cx="50" cy="10" r="2" />
                                                <circle cx="70" cy="10" r="2" />
                                                <circle cx="90" cy="10" r="2" />
                                                <circle cx="10" cy="30" r="2" />
                                                <circle cx="30" cy="30" r="2" />
                                                <circle cx="50" cy="30" r="2" />
                                                <circle cx="70" cy="30" r="2" />
                                                <circle cx="90" cy="30" r="2" />
                                                <circle cx="10" cy="50" r="2" />
                                                <circle cx="30" cy="50" r="2" />
                                                <circle cx="50" cy="50" r="2" />
                                                <circle cx="70" cy="50" r="2" />
                                                <circle cx="90" cy="50" r="2" />
                                                <circle cx="10" cy="70" r="2" />
                                                <circle cx="30" cy="70" r="2" />
                                                <circle cx="50" cy="70" r="2" />
                                                <circle cx="70" cy="70" r="2" />
                                                <circle cx="90" cy="70" r="2" />
                                                <circle cx="10" cy="90" r="2" />
                                                <circle cx="30" cy="90" r="2" />
                                                <circle cx="50" cy="90" r="2" />
                                                <circle cx="70" cy="90" r="2" />
                                                <circle cx="90" cy="90" r="2" />
                                            </g>
                                        </svg>
                                    </div>
                                
                                    <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center relative shadow-inner transform hover:scale-110 transition-all duration-300">
                                        <svg
                                            className="w-12 h-12 text-blue-500 dark:text-blue-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            ></path>
                                        </svg>
                                        <div className="absolute animate-ping w-full h-full rounded-full bg-blue-500 opacity-20"></div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Tìm kiếm bạn bè</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-0 max-w-lg mx-auto text-lg">
                                        Nhập tên hoặc username để tìm kiếm bạn bè trong hệ thống HCMUE Community
                                    </p>
                                </div>
                            )}

                            {/* Search Results Cards */}
                            {!searchLoading && searchResults.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                    {searchResults.map((user, index) => (
                                        <div key={user.userId} className="animate-fadeIn" style={{animationDelay: `${index * 100}ms`}}>
                                            <UserSuggestionCard
                                                user={{
                                                    id: user.userId,
                                                    fullName: user.fullName,
                                                    username: user.username,
                                                    image: user.image,
                                                }}
                                                onFollowToggle={(
                                                    userId,
                                                    isFollowing
                                                ) => {
                                                    handleAddFriend(userId);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Load More Button */}
                            {!searchLoading &&
                                searchResults.length > 0 &&
                                hasMore && (
                                    <div className="flex justify-center mt-12 mb-4">
                                        <button
                                            onClick={() => loadMore(searchQuery)}
                                            className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium transition-all duration-300 flex items-center shadow-sm hover:shadow transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                                        >
                                            <svg className="h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Tải thêm kết quả
                                        </button>
                                    </div>
                                )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Add global styles for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
}
