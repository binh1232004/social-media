import React from 'react';

export default function GroupReport({ group, posts, pendingPosts }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">Group Reports</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Active Members</h3>
            <p className="text-2xl font-bold text-blue-500">{group.memberCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Pending Posts</h3>
            <p className="text-2xl font-bold text-orange-500">{pendingPosts.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Total Posts</h3>
            <p className="text-2xl font-bold text-green-500">{posts.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Group Privacy</h3>
            <p className="text-2xl font-bold text-purple-500 capitalize">{group.privacy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
