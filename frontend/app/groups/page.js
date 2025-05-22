"use client";
import React, { useState, useEffect, useCallback } from "react";
import GroupCard from "../components/groups/groupCard";
import CreateGroupModal from "../components/groups/createGroupModal";
import useGroup from "../hooks/useGroup";
import { showToast } from "../utils/toast";

export default function GroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [localGroups, setLocalGroups] = useState([]);
  // Use the group hook to fetch and manage groups
  const { 
    groups, 
    pagination, 
    isLoading, 
    fetchGroups: fetchGroupsFromHook
  } = useGroup({
    onError: (error) => {
      console.error("Error in group operation:", error);
    }
  });
  
  // Wrap fetchGroups in useCallback to prevent infinite loops
  const fetchGroups = useCallback(({ page = 1, pageSize = 10 } = {}) => {
    return fetchGroupsFromHook({ page, pageSize });
  }, [fetchGroupsFromHook]);
  
  // Fetch groups when the component mounts - once only
  useEffect(() => {
    fetchGroups({ page: 1, pageSize: 10 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Update local groups when the API data changes
  useEffect(() => {
    console.log('Groups data from hook:', groups);
    if (Array.isArray(groups) && groups.length > 0) {
      console.log('Setting local groups from API data');
      setLocalGroups(groups);
    }
  }, [groups]);

  const handlePageChange = (page) => {
    fetchGroups({ page, pageSize: pagination.pageSize });
  };  const addGroup = (newGroup) => {
    console.log("Group added:", newGroup);
    
    // Immediately update the UI with the new group while we wait for the fetch
    setLocalGroups(prevGroups => {
      // Add the new group to the start of the list
      return [newGroup, ...prevGroups];
    });
    
    // Refresh the data from the server (this will be triggered by the modal already)
    // Close the modal
    setShowCreateModal(false);
  };
  // Map API groups to the format expected by GroupCard
  const mappedGroups = Array.isArray(localGroups) ? localGroups.map(group => {
    if (!group) return null;
    return {
      id: group.id || group.groupId || Math.random().toString(36).substring(7),
      name: group.groupName || group.name || "Unnamed Group",
      coverPhoto: group.image || group.coverPhoto || "https://source.unsplash.com/random/600x300/?group",
      memberCount: group.memberCount || 1,
      privacy: (group.visibility || "public").toLowerCase() === "public" ? "public" : "private",
      description: group.description || "No description available."
    };
  }).filter(Boolean) : [];  const filteredGroups = mappedGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
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
      </div>      {/* Loading State */}
      {isLoading && !filteredGroups.length && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredGroups.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No groups found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterValue !== 'all' 
              ? "Try adjusting your search or filter" 
              : "Create a new group to get started!"}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            <span className="mr-2">+</span> Create Group
          </button>
        </div>
      )}

      {/* Groups Grid */}
      {!isLoading && filteredGroups.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGroups.map(group => (
              <GroupCard 
                key={group.id} 
                group={group} 
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'border'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

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