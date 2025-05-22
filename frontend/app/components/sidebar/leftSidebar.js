"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LeftSidebar() {
    const [isOpen, setIsOpen] = useState(false);

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
            {/* Toggle Button - Visible only on small screens */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-20 left-4 z-50 md:hidden bg-blue-500 text-white p-2 rounded-full shadow-lg"
            >
                {isOpen ? "✕" : "☰"}
            </button>

            {/* Semi-transparent overlay when sidebar is open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`w-64 fixed left-0 top-16 h-full p-4 overflow-y-auto bg-white transition-all duration-300 ease-in-out z-40 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:hidden lg:block`}
            >
                <nav className="space-y-2">
                </nav>

                <div className="border-t border-gray-300 my-4"></div>

                <div className="mb-4">
                    <h3 className="font-semibold text-gray-500 mb-2">
                        Nhóm tắt
                    </h3>
                    <div className="space-y-2">
                        <Link href="/gaming" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <span className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white mr-2">
                                    🎮
                                </span>
                                <span>Gaming Group</span>
                            </div>
                        </Link>
                        <Link href="/tech" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                <span className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white mr-2">
                                    💻
                                </span>
                                <span>Tech Enthusiasts</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
