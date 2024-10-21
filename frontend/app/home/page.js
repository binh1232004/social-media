'use client';
import React from "react";
import NavBar from "../public/navbar";
import MessageBar from "../public/messageBar";

export default function HomePage() {
  return (
    <div>
      <div className="fixed">
        <NavBar/>
      </div>
      <div>
        <MessageBar/>
      </div>
      <div className="mt-24 mx-6">
        <h1 className="text-white">Đang bảo trì</h1>
      </div>
    </div>
  );
}