"use client";
import { socket } from "@/socket";
import React, { useEffect, useState } from "react";

export default function ChatBox({ onClose, name, targetId }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // First, register target ID
        socket.emit("registerTargetID", targetId);

        // Then set up message listener
        socket.on("receiveMsg", (data) => {
            console.log("Received message:", data);
            setMessages((prev) => [...prev, { 
                text: data.text, 
                sender: data.from === socket.currentID ? "me" : "other" 
            }]);
        });

        return () => {
            socket.off("receiveMsg");
        };
    }, [targetId]); // Add targetId as dependency

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit("chat", message);
            setMessages((prev) => [...prev, { 
                text: message, 
                sender: "me" 
            }]);
            setMessage("");
        }
    };


    return (
        <div className="absolute  bottom-16 right-72  w-80 h-96 bg-white rounded-t-lg shadow-lg flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold">{name}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg max-w-[80%] ${
                            msg.sender === "me"
                                ? "ml-auto bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="border-t p-3">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
