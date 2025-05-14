"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // Dummy data for demonstration
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "/person.png",
      mutualFriends: 5,
      isFriend: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "/person.png",
      mutualFriends: 3,
      isFriend: true,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/person.png",
      mutualFriends: 2,
      isFriend: false,
    },
  ]);

  const handleAddFriend = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isFriend: !user.isFriend }
        : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Find Friends</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for friends..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Image
            src="/search.png"
            alt="Search"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >              <Link href={`/user/${user.id}`} className="flex items-center space-x-4">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {user.mutualFriends} mutual friends
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleAddFriend(user.id)}
                className={`px-4 py-2 rounded-lg ${
                  user.isFriend
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {user.isFriend ? "Friends" : "Add Friend"}
              </button>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
