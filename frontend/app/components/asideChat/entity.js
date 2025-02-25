"use client";
import { socket } from "@/socket";
import React from "react";
import ChatBox from "./chatBox";

export default function Entity({ imageSrc, name, id, selectedIndexEntity, notificationCount, setSelectedIndexEntity }) {
    const handleClick = (e) => {
        e.preventDefault();
        setSelectedIndexEntity(id)
    };

    return (
        <li>
            <a
                href="#"
                onClick={handleClick}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
                <img
                    className="w-7 h-7 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                    src={imageSrc || "/person.png"}
                    alt={name}
                />
                <span className="flex-1 ms-3 whitespace-nowrap">
                    {name}
                </span>
                {notificationCount > 0 && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-red-900 dark:text-red-300">
                        {notificationCount}
                    </span>
                )}
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
