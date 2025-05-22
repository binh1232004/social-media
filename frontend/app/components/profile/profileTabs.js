"use client";
import React from "react";

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "posts", label: "Bài đăng" },
    // { id: "about", label: "About" },
    // { id: "friends", label: "Friends" },
    // { id: "photos", label: "Photos" }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow mt-4 px-4">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-6 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}