"use client";
import Image from "next/image";
import { formatDistance } from 'date-fns';
import { getUserInfo } from "@/app/utils/auth";

export default function GroupHeader({
    groupDetails,
    isMember,
    isJoining,
    handleJoinPublicGroup,
    handleJoinPrivateGroup,
    activeTab,
    setActiveTab
}) {
    const userInfo = getUserInfo();
    const userId = userInfo ? userInfo.userId : null;   
    const isAdmin = groupDetails.createdBy == userId;
    // Format the creation date for display
    const formatCreationDate = (dateString) => {
        try {
            return formatDistance(new Date(dateString), new Date(), {
                addSuffix: true,
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return "Unknown date";
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            {/* Cover photo */}
            <div className="h-48 relative bg-gray-200">
                <Image
                    src={groupDetails.image || '/group.jpg'}
                    alt={groupDetails.groupName}
                    fill
                    className="object-cover"
                    priority
                    onError={() => {
                        console.log("Image load error, replacing with fallback");
                    }}
                />
            </div>
            
            {/* Group info */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {groupDetails.groupName}
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                            <span
                                className={`mr-2 w-2 h-2 rounded-full ${
                                    groupDetails.visibility.toLowerCase() === "public"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                }`}
                            ></span>
                            {/* {groupDetails.visibility.charAt(0).toUpperCase() +
                                groupDetails.visibility.slice(1).toLowerCase()}{" "}
                            Group •  */}
                            Nhóm công khai{"\n"} 
                            •{groupDetails.memberCount.toLocaleString()}{" "}
                            thành viên
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Created {formatCreationDate(groupDetails.createdAt)}
                        </p>
                    </div>
                    
                    {isMember ? (
                        <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md">
                            Đã tham gia    
                        </button>
                    ) : groupDetails.visibility.toLowerCase() === "public" ? (
                        <button
                            onClick={handleJoinPublicGroup}
                            disabled={isJoining}
                            className={`px-4 py-1.5 ${isJoining ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md flex items-center gap-2`}
                        >
                            {isJoining ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang tham gia...</span>
                                </>
                            ) : (
                                'Tham gia ngay'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleJoinPrivateGroup}
                            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                            Yêu cầu tham gia
                        </button>
                    )}
                </div>

            </div>
            
            {/* Tabs */}
            <div className="border-t">
                <div className="flex overflow-x-auto">
                    <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === "discussion"
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("discussion")}
                    >
                        Bài viết
                    </button>
                    {/* <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === "members"
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("members")}
                    >
                        Members
                    </button> */}
                    <button
                        className={`px-4 py-3 font-medium text-sm ${
                            activeTab === "about"
                                ? "text-blue-500 border-b-2 border-blue-500"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("about")}
                    >
                        Giới thiệu
                    </button>
                    {/* Only show admin tabs if user is admin - will implement proper admin check later */}
                    {isAdmin && (
                        <>
                            <button
                                className={`px-4 py-3 font-medium text-sm ${
                                    activeTab === "report"
                                        ? "text-blue-500 border-b-2 border-blue-500"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("report")}
                            >
                                Báo cáo
                            </button>
                            <button
                                className={`px-4 py-3 font-medium text-sm ${
                                    activeTab === "pendingPosts"
                                        ? "text-blue-500 border-b-2 border-blue-500"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                onClick={() => setActiveTab("pendingPosts")}
                            >
                                Bài viết đang chờ duyệt
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}