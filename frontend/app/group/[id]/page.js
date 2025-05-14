"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import FeedSection from "../../components/feed/feedSection";
import CreatePost from "../../components/feed/createPost";
import PostCard from "../../components/feed/postCard";
import GroupReport from "../../components/groups/groupReport";

export default function GroupPage() {
  const params = useParams();
  const groupId = parseInt(params.id);

  const [group, setGroup] = useState({
    id: groupId,
    name: "Tech Enthusiasts",
    coverPhoto: "https://source.unsplash.com/random/1200x300/?technology",
    memberCount: 1243,
    privacy: "public",
    description: "A community for tech lovers to share news, discuss innovations, and connect with like-minded individuals.",
    members: [
      { id: 1, name: "John Doe", avatar: "/person.png", isAdmin: true },
      { id: 2, name: "Jane Smith", avatar: "/person.png", isAdmin: false },
      { id: 3, name: "Mike Johnson", avatar: "/person.png", isAdmin: false },
    ]
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      avatar: "/person.png",
      content: "Just found this amazing article about the future of AI. What do you all think?",
      image: "https://source.unsplash.com/random/600x400/?ai",
      likes: 24,
      comments: 5,
      time: "2 hours ago",
      status: "approved"
    },
    {
      id: 2,
      user: "Jane Smith",
      avatar: "/person.png",
      content: "Has anyone tried the new VS Code update? It has some interesting features!",
      likes: 42,
      comments: 11,
      time: "5 hours ago",
      status: "pending"
    }
  ]);

  const [pendingPosts, setPendingPosts] = useState([
    {
      id: 3,
      user: "Alice Johnson",
      avatar: "/person.png",
      content: "Waiting for approval - New tech discussion",
      likes: 0,
      comments: 0,
      time: "1 hour ago",
      status: "pending"
    }
  ]);

  const handlePostApproval = (postId, isApproved) => {
    const postToUpdate = pendingPosts.find(post => post.id === postId);
    if (postToUpdate) {
      if (isApproved) {
        setPosts([{ ...postToUpdate, status: "approved" }, ...posts]);
      }
      setPendingPosts(pendingPosts.filter(post => post.id !== postId));
    }
  };

  const [activeTab, setActiveTab] = useState("discussion");
  const [isMember, setIsMember] = useState(false);

  const addNewPost = (post) => {
    setPosts([
      {
        id: posts.length + 1,
        user: "You",
        avatar: "/person.png",
        content: post.content,
        image: post.image,
        likes: 0,
        comments: 0,
        time: "Just now",
        status: "approved"
      },
      ...posts
    ]);
  };

  return (
    <>
      {/* Group Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
        {/* Cover photo */}
        <div className="h-48 relative">
          <img
            src={group.coverPhoto}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Group info */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <span className={`mr-2 w-2 h-2 rounded-full ${group.privacy === "public" ? "bg-green-500" : "bg-gray-500"
                  }`}></span>
                {group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)} Group •
                {group.memberCount.toLocaleString()} members
              </p>
            </div>

            {isMember ? (
              <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md">
                Joined
              </button>
            ) : (
              <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                {group.privacy === "private" ? "Request to Join" : "Join Group"}
              </button>
            )}
          </div>

          <p className="mt-3">{group.description}</p>
        </div>

        {/* Tabs */}
        <div className="border-t">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-3 font-medium text-sm ${activeTab === "discussion"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("discussion")}
            >
              Discussion
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${activeTab === "members"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>            <button
              className={`px-4 py-3 font-medium text-sm ${activeTab === "about"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            {group.members.find(member => member.isAdmin)?.id === 1 && (
              <>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === "report"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("report")}
                >
                  Report
                </button>
                <button
                  className={`px-4 py-3 font-medium text-sm ${activeTab === "pendingPosts"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  onClick={() => setActiveTab("pendingPosts")}
                >
                  Pending Posts
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "discussion" && (
        <div>
          {isMember ? (
            <>
              <div className="mt-4">
                <FeedSection posts={posts} />
              </div>
            </>
          ) : (
            <div className="space-y-6 mt-3">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => { }} // No-op function since non-members can't like
                />
              ))}

              {posts.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">Join this group to see discussions and post content.</p>
                  <button
                    onClick={() => setIsMember(true)}
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    {group.privacy === "private" ? "Request to Join" : "Join Group"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "members" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Members ({group.members.length})</h2>
          <div className="space-y-3">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />                <div>
                    <p className="font-medium">{member.name}</p>
                    {member.isAdmin && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {activeTab === "pendingPosts" && (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <h2 className="text-lg font-semibold mb-4">Posts Pending Approval</h2>
          <div className="space-y-4">
            {pendingPosts.map(post => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-medium">{post.user}</p>
                    <p className="text-sm text-gray-500">{post.time}</p>
                  </div>
                </div>
                <p className="mb-4">{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post content" className="rounded-lg mb-4 max-h-96 w-full object-cover" />
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePostApproval(post.id, true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handlePostApproval(post.id, false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}            {pendingPosts.length === 0 && (
              <p className="text-gray-500 text-center py-4">No posts pending approval</p>
            )}
          </div>
        </div>
      )}      {activeTab === "report" && (
        <GroupReport 
          group={group}
          posts={posts}
          pendingPosts={pendingPosts}
        />
      )}
    </>
  );
}