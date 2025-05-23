"use client";
import React from "react";
import ChatBox from "./chatBox";

export default function Entity({ imageSrc, name, id, selectedIndexEntity, notificationCount, setSelectedIndexEntity }) {
    const handleClick = (e) => {
        e.preventDefault();
        setSelectedIndexEntity(id)
    };    return (
        <li className="list-none">
            <a
                href="#"
                onClick={handleClick}
                className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-blue-50 group transition-colors duration-200"
            >                <div className="relative">
                    <img
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-blue-100 transition-colors"
                        src={imageSrc || "/person.png"}
                        alt={name}
                    />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full">
                            {notificationCount}
                        </span>
                    )}
                </div>
                <span className="flex-1 ms-3 whitespace-nowrap font-medium group-hover:text-blue-600">
                    {name}
                </span>
            </a>
            {selectedIndexEntity === id && (
                <ChatBox
                    name={name}
                    targetId={id}
                    onClose={() => setSelectedIndexEntity(null)}  
                />
            )}
        </li>
    );
}
