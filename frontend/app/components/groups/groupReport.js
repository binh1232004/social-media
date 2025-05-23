"use client";
import React, { useState, useEffect } from 'react';
import { useGroupPosts } from '@/app/hooks/useGroupPosts';
import { usePendingGroupPosts } from '@/app/hooks/usePendingGroupPosts';

export default function GroupReport({ group }) {
  const [postCount, setPostCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Use the hooks with lazy loading flag
  const groupId = group?.groupId;
  const { posts } = useGroupPosts(groupId);
  const { pendingPosts } = usePendingGroupPosts(groupId);
  
  // Update counts when data is loaded
  useEffect(() => {
    if (posts) {
      setPostCount(posts.length || 0);
    }
  }, [posts]);
  
  useEffect(() => {
    if (pendingPosts) {
      setPendingCount(pendingPosts.length || 0);
    }
  }, [pendingPosts]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">Báo cáo nhóm</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2"> Số lượng thành viên </h3>
            <p className="text-2xl font-bold text-blue-500">{group.memberCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Bài viết đang chờ duyệt</h3>
            <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Tổng số bài viết trong nhóm</h3>
            <p className="text-2xl font-bold text-green-500">{postCount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Chế độ </h3>
            {/* <p className="text-2xl font-bold text-purple-500 capitalize">{group.visibility?.toLowerCase()}</p> */}
            <p className="text-2xl font-bold text-purple-500 capitalize">Công khai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
