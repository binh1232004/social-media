"use client";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { useState } from "react";
import { showToast } from "../../utils/toast";

export default function PendingPostItem({ post, onApprove, onDeny }) {
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleApprove = async () => {
        onApprove(post.id);
    };

    const handleDeny = async () => {
        setIsProcessing(true);
        try {
            // First, hide the post by setting isVisible to false
            const hideResponse = await fetch('/api/proxy/group-posts/visible', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: post.id,
                    isVisible: false
                })
            });
            
            if (!hideResponse.ok) {
                const errorData = await hideResponse.json();
                throw new Error(errorData.error || 'Failed to hide post');
            }
            
            // Then deny the post using the existing onDeny callback
            onDeny(post.id);
            
            showToast('Bài viết đã bị ẩn và từ chối', 'success');
        } catch (error) {
            console.error('Error handling post denial:', error);
            // showToast(error.message || 'Có lỗi xảy ra khi từ chối bài viết', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {post.isVisible ? (
                <div className="border rounded-lg p-4 bg-white shadow">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full mr-3 overflow-hidden flex-shrink-0">
                            {" "}
                            {/* Added container with fixed size and overflow-hidden */}
                            <Image
                                src={post.user.avatarUrl || "/avatar.png"} // Fallback to a default avatar
                                alt={post.user.name}
                                width={40} // Width of the image
                                height={40} // Height of the image
                                className="object-cover w-full h-full" // Ensure image covers the container
                            />
                        </div>
                        <div>
                            <p className="font-semibold">{post.user.name}</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNowStrict(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                )}
                            </p>
                        </div>
                    </div>

                    <p className="mb-3 text-gray-800">{post.content}</p>

                    {post.media && post.media.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                            {post.media.map((mediaItem) => (
                                <div
                                    key={mediaItem.id || mediaItem.url}
                                    className="relative aspect-square rounded-md overflow-hidden"
                                >
                                    {mediaItem.type === "image" && (
                                        <Image
                                            src={mediaItem.url}
                                            alt="Pending post media"
                                            fill
                                            className="object-cover"
                                            unoptimized={
                                                mediaItem.url.startsWith(
                                                    "blob:"
                                                ) ||
                                                mediaItem.url.startsWith(
                                                    "data:"
                                                )
                                            }
                                        />
                                    )}
                                    {mediaItem.type === "video" && (
                                        <video
                                            controls
                                            src={mediaItem.url}
                                            className="w-full h-full object-cover"
                                        >
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    )}
                                    {/* Add more media types if necessary */}
                                </div>
                            ))}
                        </div>
                    )}                    <div className="flex space-x-3 mt-4 pt-3 border-t">
                        <button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-green-300 disabled:cursor-not-allowed"
                        >
                            Đồng ý
                        </button>
                        <button
                            onClick={handleDeny}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center space-x-1"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                'Từ chối'
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}
