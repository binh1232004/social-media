"use client";
import React, { useState } from "react";
import GroupCard from "../components/groups/groupCard";
import CreateGroupModal from "../components/groups/createGroupModal";

export default function GroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Tech Enthusiasts",
      coverPhoto: "https://source.unsplash.com/random/600x300/?technology",
      memberCount: 1243,
      privacy: "public",
      description: "A community for tech lovers to share news, discuss innovations, and connect with like-minded individuals."
    },
    {
      id: 2,
      name: "Photography Club",
      coverPhoto: "https://source.unsplash.com/random/600x300/?photography",
      memberCount: 876,
      privacy: "public",
      description: "Share your best shots, get feedback, and learn photography techniques from experts."
    },
    {
      id: 3,
      name: "Exclusive Gaming Squad",
      coverPhoto: "https://source.unsplash.com/random/600x300/?gaming",
      memberCount: 42,
      privacy: "private",
      description: "A private group for our gaming squad to organize gaming sessions and tournaments."
    },
    {
      id: 4,
      name: "Fitness & Wellness",
      coverPhoto: "https://source.unsplash.com/random/600x300/?fitness",
      memberCount: 753,
      privacy: "public",
      description: "Tips, workouts, and motivation for your fitness and wellness journey."
    }
  ]);

  const addGroup = (newGroup) => {
    setGroups([
      {
        ...newGroup,
        id: groups.length + 1,
        memberCount: 1 // You as the creator
      },
      ...groups
    ]);
    setShowCreateModal(false);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterValue) {
      case "public":
        return matchesSearch && group.privacy === "public";
      case "private":
        return matchesSearch && group.privacy === "private";
      default:
        return matchesSearch;
    }
  });

  return (
    <>
      {/* Groups Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groups</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span> Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full rounded-lg border px-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="rounded-lg border px-4 py-2 bg-white"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="all">All Groups</option>
          <option value="public">Public Groups</option>
          <option value="private">Private Groups</option>
        </select>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGroups.map(group => (
          <GroupCard 
            key={group.id} 
            group={group} 
          />
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={addGroup}
        />
      )}
    </>
  );
}