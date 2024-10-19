'use client';
import React from "react";
import NavBar from "../public/navbar";

export default function HomePage() {
  return (
    <div className="">
      <div>
        <NavBar/>
      </div>
      <div className="mt-24 mx-6">
        <h1 className="text-white">Đang bảo trì</h1>
      </div>
    </div>
  );
}