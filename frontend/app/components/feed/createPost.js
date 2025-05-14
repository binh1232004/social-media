"use client";
import React, { useState, useRef } from "react";

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const fileInputRef = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onPostCreated({
                content,
                image: imageUrl || null
            });
            setContent("");
            setImageUrl("");
            setSelectedFileName("");
            setShowImageInput(false);
        }
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            // Create a URL for the file
            const fileURL = URL.createObjectURL(file);
            setImageUrl(fileURL);
        }
    };
    
    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                    />
                </form>
            </div>
            
            {showImageInput && (
                <div className="mb-3">
                    <div className="flex flex-col gap-2">
                        {/* Hidden actual file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
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
                            Choose Image
                        </button>
                        
                        {/* Display selected file name */}
                        {selectedFileName && (
                            <div className="flex items-center mt-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                    Selected:
                                </span>
                                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                    {selectedFileName}
                                </span>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setSelectedFileName("");
                                        setImageUrl("");
                                        fileInputRef.current.value = "";
                                    }}
                                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        
                        {/* Preview image if available */}
                        {imageUrl && (
                            <div className="mt-2 relative">
                                <img 
                                    src={imageUrl} 
                                    alt="Preview" 
                                    className="max-h-40 rounded-md object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="flex border-t pt-3">
                <button 
                    onClick={() => setShowImageInput(!showImageInput)} 
                    className="flex-1 flex items-center justify-center py-1 hover:bg-gray-100 rounded-lg"
                >
                    <span className="mr-2">🖼️</span> Photo/Video
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="ml-2 bg-blue-500 text-white rounded-lg px-4 hover:bg-blue-600"
                >
                    Post
                </button>
            </div>
        </div>
    );
}