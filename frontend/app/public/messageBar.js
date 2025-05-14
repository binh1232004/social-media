"use client";
import React, { useEffect, useState } from "react";
import Entity from "../components/asideChat/entity";

export default function MessageBar() {
    const user = 4;
    const [selectedEntity, setSelectedIndexEntity] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClickEntity = (order) => {
        setSelectedIndexEntity(order);
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
                <div className="h-full px-4 py-4 hover:overflow-y-auto py-20 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {" "}
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm pb-4 -mx-4 px-4 border-b border-gray-100">
                        <div className="flex justify-between items-center py-2">
                            <div className="flex items-center space-x-3">
                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                    <img
                                        src="/messenger.png"
                                        className="h-6 sm:h-7 transition-transform group-hover:scale-105"
                                        alt="Messenger Logo"
                                    />
                                </div>
                                <span className="text-lg font-semibold text-gray-700">
                                    Người liên hệ
                                </span>
                            </div>
                            <div className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                                <img
                                    src="/search.png"
                                    className="w-5 h-5 opacity-60 hover:opacity-100"
                                    alt="Search"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        {[...Array(user)].map((_, index) => (
                            <Entity
                                key={index}
                                name={`Full name ${index + 1}`}
                                notificationCount={index + 1}
                                id={index + 1}
                                onClick={() => handleClickEntity(index + 1)}
                                selectedIndexEntity={selectedEntity}
                                setSelectedIndexEntity={setSelectedIndexEntity}
                            />
                        ))}{" "}
                    </div>
                </div>
            </aside>
        </>
    );
}
