"use client";
import React, { useEffect } from "react";
import Entity from "../components/asideChat/entity";
import { useState } from "react";

export default function MessageBar() {
    const user = 4;
    const group = 2;
    const [selectedEntity, setSelectedIndexEntity] = useState(null);   
    const handleClickEntity = (order) => {
        setSelectedIndexEntity(order);
    }
    useEffect(() => {   
        console.log("Selected entity index:", selectedEntity);  
    }, [selectedEntity]);
    return (
        <aside
            id="default-sidebar"
            className="fixed top-16 right-0   w-72 h-full pb-16  bg-white  "
            aria-label="Sidebar"
        >
            <div className="h-full px-3 py-4 hover:overflow-y-scroll py-20">
                <a href="#" className="flex justify-between items-center mb-4">
                    <div className="flex cursor-text">
                        <img
                            src="/messenger.png"
                            className="h-6 me-3 sm:h-7 "
                            alt="Messenger Logo"
                        />
                        <span className="text-xl font-semibold whitespace-nowrap dark:text-slate-500">
                            Người liên hệ
                        </span>
                    </div>
                    <div className="flex w-9 h-9 justify-center items-center rounded-full hover:bg-blue-900 hover:ring-sky-500 cursor-pointer">
                        <img src="/search.png" className="w-6 h-6" />
                    </div>
                </a>
                <ul className="space-y-2 font-medium">
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
                    ))}
                </ul>
                <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
                    <li>
                        <a
                            href="#"
                            className="flex items-center ps-2.5 mb-5 cursor-text"
                        >
                            <img
                                src="/group.png"
                                className="h-6 me-3 sm:h-7"
                                alt="Messenger Logo"
                            />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-slate-500">
                                Nhóm chat
                            </span>
                        </a>
                    </li>
                    {/* {[...Array(group)].map((_, index) => (
                        <Entity
                            key={index}
                            name={`group name ${index + 1}`}
                            notificationCount={index + 1}
                        />
                    ))} */}
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                            <img
                                className="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                src="/add.png"
                            />
                            <span className="ms-3">Thêm nhóm chat</span>
                        </a>
                    </li>
                </ul>
            </div>

        </aside>
    );
}
