"use client";
import React, { useState, useEffect } from "react";
import FeedSection from "../components/feed/feedSection";

export default function HomePage() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: "John Doe",
            avatar: "/person.png",
            content: "Just had an amazing day at the beach! 🏖️",
            image: "https://source.unsplash.com/random/600x400/?beach",
            likes: 24,
            comments: 5,
            time: "2 hours ago"
        },
        {
            id: 2,
            user: "Jane Smith",
            avatar: "/person.png",
            content: "Check out my new coding project - a social media platform!",
            likes: 42,
            comments: 11,
            time: "5 hours ago"
        },
        {
            id: 3,
            user: "Mike Johnson",
            avatar: "/person.png",
            content: "Anyone interested in going hiking this weekend?",
            image: "https://source.unsplash.com/random/600x400/?hiking",
            likes: 18,
            comments: 7,
            time: "Yesterday"
        }
    ]);

    return <FeedSection posts={posts} />;
}
