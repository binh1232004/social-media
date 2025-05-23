"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { uploadToAzureStorage, getMediaTypeFromMimeType } from "../../utils/azureStorage";
import { showToast } from "../../utils/toast";

export default function GroupCreatePost({ groupId, onPostCreated, refreshPosts }) {
    const [content, setContent] = useState("");
    const [showMediaInput, setShowMediaInput] = useState(false);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const mediaFileRef = useRef(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            return;
        }
        
        setSubmitting(true);
        setError(null);
        
        try {
            // Create the request body with groupId
            const requestBody = {
                content: content,
                groupId: groupId,
                media: []
            };
            
            // Upload media file if one was selected
            if (mediaFileRef.current) {
                try {
                    // Upload the file to Azure Storage via our API route
                    const uploadResult = await uploadToAzureStorage(mediaFileRef.current);
                    
                    // Add the media information to the request body
                    requestBody.media.push({
                        mediaUrl: uploadResult.mediaUrl,
                        mediaType: uploadResult.mediaType
                    });
                    
                } catch (uploadError) {
                    throw new Error(`Không thể tải lên file: ${uploadError.message}`);
                }
            }
            
            // Send the post to the group posts API
            const response = await fetch("/api/proxy/group-posts", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Lỗi: ${response.status}`);
            }
            
            const data = await response.json();
              // Show appropriate message based on whether posts need approval
            if (data.isApproved === false) {
                showToast("Bài viết đang chờ được xác nhận", "info");
            } else {
                showToast("Bài viết đã được đăng thành công!", "success");
            }
            
            // Call the onPostCreated callback with the new post data
            if (onPostCreated) {
                onPostCreated(data);
            }
            
            // Refresh the posts list if the function is available
            if (typeof refreshPosts === 'function') {
                refreshPosts();
            }
            
            // Reset the form
            setContent("");
            setMediaPreviewUrl("");
            setSelectedFileName("");
            setShowMediaInput(false);
            mediaFileRef.current = null;
            
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error("Error creating group post:", err);
            setError(err.message || "Unable to create post");
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const isValidType = 
                file.type.startsWith('image/') || 
                file.type === 'application/pdf' ||
                file.type === 'application/msword' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                
            if (!isValidType) {
                showToast("Please upload an image, PDF, or Word document", "error");
                return;
            }
            
            setSelectedFileName(file.name);
            // Store the file reference for later upload
            mediaFileRef.current = file;
            
            // Only create preview URL for images
            if (file.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(file);
                setMediaPreviewUrl(previewUrl);
            } else {
                setMediaPreviewUrl("");
            }
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    
    const getFileIcon = (fileName) => {
        if (!fileName) return '📎';
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            default:
                return '📎';
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-3">
                <form onSubmit={handleSubmit} className="flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full rounded-full bg-gray-100 px-4 py-2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={submitting}
                    />
                </form>
            </div>
            
            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            {showMediaInput && (
                <div className="mb-3">
                    <div className="flex flex-col gap-2">
                        {/* Hidden actual file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={submitting}
                        />
                        
                        {/* Custom styled button */}
                        <button 
                            type="button"
                            onClick={triggerFileInput}
                            className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Choose File
                        </button>
                        
                        {/* Display selected file name with icon */}
                        {selectedFileName && (
                            <div className="flex items-center mt-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                    Selected:
                                </span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <span>{getFileIcon(selectedFileName)}</span>
                                    <span className="truncate max-w-[200px]">{selectedFileName}</span>
                                </span>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setSelectedFileName("");
                                        setMediaPreviewUrl("");
                                        fileInputRef.current.value = "";
                                        mediaFileRef.current = null;
                                    }}
                                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        
                        {/* Preview image if available */}
                        {mediaPreviewUrl && (
                            <div className="mt-2 relative h-40">
                                <Image 
                                    src={mediaPreviewUrl} 
                                    alt="Preview" 
                                    fill
                                    className="rounded-md object-contain"
                                    unoptimized={mediaPreviewUrl.startsWith('blob:')}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex border-t pt-3">
                <button 
                    type="button"
                    onClick={() => setShowMediaInput(!showMediaInput)}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center py-1 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                >
                    <span className="mr-2">📎</span> Attach file
                </button>
                <button 
                    type="button"
                    onClick={handleSubmit} 
                    disabled={submitting || !content.trim()}
                    className="ml-2 bg-blue-500 text-white rounded-lg px-4 hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300"
                >
                    {submitting ? (
                        <div className="flex items-center">
                            <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                            Posting...
                        </div>
                    ) : (
                        "Post"
                    )}
                </button>
            </div>
        </div>
    );
}
