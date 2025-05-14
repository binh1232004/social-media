"use client";
import React, { useState } from "react";

export default function CreateGroupModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "public",
    coverPhoto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Group</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Group Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="What's this group about?"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Privacy
            </label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="public"
                  name="privacy"
                  value="public"
                  checked={formData.privacy === "public"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="public">
                  Public
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="private"
                  name="privacy"
                  value="private"
                  checked={formData.privacy === "private"}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="private">
                  Private
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.privacy === "public" 
                ? "Anyone can see the group, its members and their posts."
                : "Only members can see the group, its members and their posts."}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Cover Photo URL
            </label>
            <input
              type="text"
              name="coverPhoto"
              value={formData.coverPhoto}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
            {formData.coverPhoto && (
              <div className="mt-2 h-32 overflow-hidden rounded-lg">
                <img 
                  src={formData.coverPhoto} 
                  alt="Cover Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}