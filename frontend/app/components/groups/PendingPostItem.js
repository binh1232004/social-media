
"use client";
import Image from "next/image";
import { formatDistanceToNowStrict } from 'date-fns';

export default function PendingPostItem({ post, onApprove, onDeny }) {
    const handleApprove = () => {
        onApprove(post.id);
    };

    const handleDeny = () => {
        onDeny(post.id);
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow">
            <div className="flex items-center mb-3">
                <Image
                    src={post.user.avatarUrl || '/avatar.png'} // Fallback to a default avatar
                    alt={post.user.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                />
                <div>
                    <p className="font-semibold">{post.user.name}</p>
                    <p className="text-sm text-gray-500">
                        {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>

            <p className="mb-3 text-gray-800">{post.content}</p>

            {post.media && post.media.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {post.media.map((mediaItem) => (
                        <div key={mediaItem.id || mediaItem.url} className="relative aspect-square rounded-md overflow-hidden">
                            {mediaItem.type === 'image' && (
                                <Image
                                    src={mediaItem.url}
                                    alt="Pending post media"
                                    fill
                                    className="object-cover"
                                    unoptimized={mediaItem.url.startsWith("blob:") || mediaItem.url.startsWith("data:")}
                                />
                            )}
                            {mediaItem.type === 'video' && (
                                <video controls src={mediaItem.url} className="w-full h-full object-cover">
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {/* Add more media types if necessary */}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex space-x-3 mt-4 pt-3 border-t">
                <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                    Đồng ý
                </button>
                <button
                    onClick={handleDeny}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                    Từ chối
                </button>
            </div>
        </div>
    );
}
