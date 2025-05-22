"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getAuthToken } from "../../utils/auth";
import { publish } from "../../utils/events";
import Toast from "../ui/toast";

export default function EditProfileModal({
    profileData,
    isOpen,
    onClose,
    onSuccess,
}) {    const [formData, setFormData] = useState({
        fullName: "",
        intro: "",
        birthday: "",
        gender: "",
        image: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [toast, setToast] = useState(null);
    // Initialize form with existing profile data
    useEffect(() => {
        if (profileData) {
            setFormData({
                fullName: profileData.name || "",
                intro: profileData.bio || "",
                birthday: profileData.birthday || "",
                gender: profileData.gender || "",
                image: profileData.avatar || "",
            });
            setPreviewImage(profileData.avatar);
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
            setError(
                "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
            );
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError(
                "Image file is too large. Please select an image under 5MB."
            );
            return;
        }

        // Create a preview of the selected image
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target.result);
            setError(null); // Clear any previous errors
        };
        reader.onerror = () => {
            setError("Error reading the image file. Please try another image.");
        };
        reader.readAsDataURL(file);

        // Store the file in the form data
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("You must be logged in to update your profile");
            }

            // Create a FormData object for profile update
            const profileUpdateData = new FormData();

            // Add user data to the form
            profileUpdateData.append("fullName", formData.fullName);
            if (formData.intro) profileUpdateData.append("intro", formData.intro);
            if (formData.birthday)
                profileUpdateData.append("birthday", formData.birthday);
            if (formData.gender) profileUpdateData.append("gender", formData.gender);

            // Step 1: Handle image upload if there's a new image file
            let imageUrl = formData.image;
            if (formData.image instanceof File) {
                // Create a separate FormData for the image upload
                const imageFormData = new FormData();
                imageFormData.append("file", formData.image);

                // Upload the image to Azure through the media API
                const uploadResponse = await axios.post(
                    "/api/upload-media",
                    imageFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // Content-Type is automatically set by axios for FormData
                        },
                    }
                );

                // Get the image URL from the response
                if (uploadResponse.data && uploadResponse.data.mediaUrl) {
                    imageUrl = uploadResponse.data.mediaUrl;
                    console.log("Image uploaded successfully:", imageUrl);
                } else {
                    console.error(
                        "Image upload response missing mediaUrl:",
                        uploadResponse.data
                    );
                    throw new Error("Failed to upload image. Please try again.");
                }
            }

            // If we have an image URL (either from the upload or an existing URL), add it to the profile update data
            if (
                imageUrl &&
                typeof imageUrl === "string" &&
                (imageUrl !== profileData.avatar || formData.image instanceof File)
            ) {
                profileUpdateData.append("image", imageUrl);
            }

            // Step 2: Make the API call to update the profile
            const response = await axios.put(
                `/api/proxy/user/${profileData.userId}`,
                profileUpdateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Content-Type is automatically set by axios for FormData
                    },
                }
            );            if (response.status === 200 || response.status === 204) {
                // Show success toast
                setToast({
                    message: 'Profile updated successfully!',
                    type: 'success'
                });
                
                // Notify all components that the avatar might have changed
                publish("avatar-updated", response.data?.image || imageUrl || null);

                // Add a short delay to show the toast before closing the modal
                setTimeout(() => {
                    // Call success callback with the updated profile data (if available)
                    if (response.data) {
                        onSuccess?.(response.data);
                    } else {
                        onSuccess?.();
                    }
                    onClose();
                }, 1500); // 1.5 seconds delay to show the toast
            }
        } catch (err) {
            console.error("Error updating profile:", err);

            // Provide a more user-friendly error message
            if (err.response?.status === 413) {
                setError(
                    "The image file is too large. Please choose a smaller image."
                );
            } else if (err.response?.status === 415) {
                setError(
                    "The image format is not supported. Please use JPEG, PNG, or GIF."
                );
            } else if (err.response?.status === 401) {
                setError("Your session has expired. Please sign in again.");
            } else {
                setError(
                    err.response?.data?.error ||
                        err.message ||
                        "Failed to update profile. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Toast notification */}
            {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Chỉnh sửa trang cá nhân
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={onClose}
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 space-y-4">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center">
                                <div className="mb-4 relative">
                                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow">
                                        <Image
                                            src={previewImage || "/avatar.png"}
                                            alt="Profile"
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <label
                                        htmlFor="image-upload"
                                        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer shadow-md"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <input
                                            id="image-upload"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Bio / Intro */}
                            <div>
                                <label
                                    htmlFor="intro"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Giới thiệu
                                </label>
                                <textarea
                                    id="intro"
                                    name="intro"
                                    rows={3}
                                    value={formData.intro}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                ></textarea>
                            </div>

                            {/* Birthday */}
                            <div>
                                <label
                                    htmlFor="birthday"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                   Giới tính
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Lựa chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                Đóng
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isSubmitting ? "Lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
