"use client";
import useGroup from "@/app/hooks/useGroup";
import React, { useState } from "react";
import Image from "next/image";

export default function CreateGroupModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        privacy: "public",
        coverPhoto: "",
        coverPhotoFile: null,
    });

    // Add a new state to track if the form has been submitted
    const [hasSubmitted, setHasSubmitted] = useState(false); // Use the group hook with success/error callbacks
    const { fetchToProxyApiCreateGroup, isCreating, fetchGroups } = useGroup({
        onSuccess: (data) => {
            console.log("Group created:", data);
            // Refresh the groups list
            console.log("Refreshing groups data after successful creation");
            // Force refetch and wait for it to complete before closing modal
            fetchGroups({ page: 1, pageSize: 10, forceRefresh: true }).then(
                (data) => {
                    console.log("Groups refreshed:", data);
                }
            );

            // Pass the created group data to the parent component and close modal
            if (onSubmit) {
                const mappedGroup = {
                    id: data.id || data.groupId,
                    name: data.groupName || data.name,
                    coverPhoto:
                        data.image || data.coverPhoto || formData.coverPhoto,
                    privacy:
                        data.visibility?.toLowerCase() === "public"
                            ? "public"
                            : "private",
                    description: data.description || "",
                    memberCount: 1,
                };
                onSubmit(mappedGroup);
            }
            // Close the modal
            if (onClose) {
                onClose();
            }
        },
        onError: (error) => {
            console.error("Error creating group:", error);
            // Reset submission state to allow resubmitting
            setHasSubmitted(false);
        },
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set submission state to true immediately to disable the button
        setHasSubmitted(true);

        const { name, privacy, coverPhoto, coverPhotoFile } = formData;

        // Prepare the group data
        let groupData = {
            groupName: name,
            privacy: privacy, // This will be mapped to visibility in the API route
        };

        // If there's a cover photo file, handle it
        if (coverPhotoFile) {
            try {
                // Create a FormData object to upload the file
                const imageFormData = new FormData();
                imageFormData.append("file", coverPhotoFile);

                // Upload the image using the media upload API
                const uploadResponse = await fetch("/api/upload-media", {
                    method: "POST",
                    body: imageFormData,
                });

                if (uploadResponse.ok) {
                    const uploadResult = await uploadResponse.json();
                    // Add the uploaded image URL to the group data
                    groupData.coverPhoto = uploadResult.mediaUrl;
                } else {
                    console.error(
                        "Failed to upload image:",
                        await uploadResponse.text()
                    );
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        } else if (coverPhoto) {
            // If there's a direct URL (for backward compatibility)
            groupData.coverPhoto = coverPhoto;
        }
        // Create the group using the hook
        // The onSuccess callback will handle calling onSubmit and closing the modal
        await fetchToProxyApiCreateGroup(groupData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tạo nhóm mới </h2>
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
                          Tên nhóm
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nhập tên nhóm"
                            required
                        />
                    </div>
                    {/* <div className="mb-4">
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
                                <label htmlFor="public">Public</label>
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
                                <label htmlFor="private">Private</label>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.privacy === "public"
                                ? "Anyone can see the group, its members and their posts."
                                : "Only members can see the group, its members and their posts."}
                        </p>
                    </div>{" "} */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Ảnh bìa
                        </label>
                        {formData.coverPhoto ? (
                            <div className="mb-3">
                                <div className="flex items-center">
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-blue-200 flex-shrink-0">
                                        <Image
                                            src={formData.coverPhoto}
                                            alt="Cover Preview"
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/200x200?text=Invalid";
                                            }}
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                                            {formData.coverPhotoFile?.name ||
                                                "Image selected"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formData.coverPhotoFile
                                                ? `${(
                                                      formData.coverPhotoFile
                                                          .size /
                                                      (1024 * 1024)
                                                  ).toFixed(2)} MB`
                                                : ""}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    coverPhoto: "",
                                                    coverPhotoFile: null,
                                                }))
                                            }
                                            className="text-xs text-red-500 hover:text-red-700 mt-1 flex items-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Loại bỏ
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative flex items-center border-2 border-dashed border-gray-300 rounded-lg py-3 px-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload cover photo
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF (Max 5MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name="coverPhotoFile"
                                    id="coverPhotoFile"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            // Check file size (5MB max)
                                            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                                            if (file.size > maxSize) {
                                                alert(
                                                    "File is too large. Maximum size is 5MB."
                                                );
                                                e.target.value = null; // Clear the input
                                                return;
                                            }

                                            // Create a local URL for the file for preview
                                            const fileUrl =
                                                URL.createObjectURL(file);
                                            setFormData((prev) => ({
                                                ...prev,
                                                coverPhoto: fileUrl,
                                                coverPhotoFile: file,
                                            }));
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isCreating}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>{" "}
                        <button
                            type="submit"
                            disabled={isCreating || hasSubmitted}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                        >
                            {isCreating || hasSubmitted ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Đang tạo...
                                </>
                            ) : (
                                "Tạo nhóm"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
