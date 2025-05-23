"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function GroupCard({ group }) {
    const { id, name, coverPhoto, memberCount, privacy, description } = group;
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Cover Photo with Privacy Badge */}
            <div className="relative h-40">
                <img
                    src={coverPhoto}
                    alt={name}
                    className="w-full h-full object-cover"
                />
                <span
                    className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                        privacy === "private"
                            ? "bg-gray-800 text-white"
                            : "bg-blue-100 text-blue-800"
                    }`}
                >
                    {privacy === "private" ? "Riêng tư" : "Công khai"}
                </span>
            </div>

            {/* Group Info */}
            <div className="p-4">
                <Link href={`/group/${id}`}>
                    <h3 className="font-semibold text-lg hover:underline">
                        {name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">
                    {memberCount.toLocaleString()} thành viên
                </p>
            </div>

            {/* Join/View Button */}
            <div className="px-4 py-3 border-t">
                <Link href={`/group/${id}`}>
                    <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                        {/* {privacy === "private" ? "Request to Join" : "Join Group"} */}
                        Xem nhóm
                    </button>
                </Link>
            </div>
        </div>
    );
}
