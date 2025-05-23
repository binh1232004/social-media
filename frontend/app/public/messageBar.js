"use client";
import React, { useEffect, useState } from "react";
import Entity from "../components/asideChat/entity";
import { useFollowing } from "../hooks/useFollowing";
import { getUserInfo } from "../utils/auth";

export default function MessageBar() {
    // Replace mock user count with real data from API
    const [selectedEntity, setSelectedIndexEntity] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    
    // Use the hook to fetch following users
    const { followingUsers, isLoading, error, hasMore, loadMore } = useFollowing(0, 20);

    const handleClickEntity = (id) => {
        setSelectedIndexEntity(id);
    };

    useEffect(() => {
        console.log("Selected entity index:", selectedEntity);
    }, [selectedEntity]);

    // Close sidebar on medium+ screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Toggle Button - Visible only on small screens */}{" "}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-20 right-4 z-50 md:hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
                {isOpen ? (
                    <span className="text-xl">✕</span>
                ) : (
                    <span className="text-xl">💬</span>
                )}
            </button>
            {/* Semi-transparent overlay when sidebar is open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            <aside
                id="default-sidebar"
                className={`fixed top-16 right-0 w-72 h-full pb-16 bg-white/95 backdrop-blur-sm shadow-lg z-40 transition-all duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } md:translate-x-0 md:hidden lg:block border-l border-gray-100`}
                aria-label="Sidebar"
            >
                <div className="h-full px-4 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {" "}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm pb-4 -mx-4 px-4 border-b border-gray-100">
                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-lg font-semibold text-gray-700">
                                    Người liên hệ
                                </span>
                            </div>
                            
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        {isLoading && followingUsers.length === 0 ? (
                            <div className="flex justify-center py-4">
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-4">
                                <p>Không thể tải danh sách liên hệ</p>
                            </div>
                        ) : followingUsers.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                <p>Chưa có người liên hệ nào</p>
                            </div>
                        ) : (
                            followingUsers.map((followData) => {
                                const user = followData.followed;
                                return (
                                    <Entity
                                        key={user.userId}
                                        name={user.fullName || user.username}
                                        imageSrc={user.image}
                                        id={user.userId}
                                        notificationCount={0} // You may want to implement notification count from API
                                        selectedIndexEntity={selectedEntity}
                                        setSelectedIndexEntity={setSelectedIndexEntity}
                                    />
                                );
                            })
                        )}
                        
                        {isLoading && followingUsers.length > 0 && (
                            <div className="flex justify-center py-2">
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        
                        {hasMore && !isLoading && followingUsers.length > 0 && (
                            <button 
                                onClick={loadMore}
                                className="w-full text-center text-sm text-blue-500 hover:text-blue-600 py-2"
                            >
                                Tải thêm
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
