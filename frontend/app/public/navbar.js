"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../components/UserAvatar";

export default function NavBar() {
    const [currentID, setCurrentID] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle navbar appearance change on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Socket.IO functionality removed
    const handleClickID = () => {
        console.log(currentID);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    const navigationLinks = [{label: 'Trang chủ', link: 'home'}, {label:'Bạn bè', link:"friends"}, {label: 'Nhóm', link: 'groups'}]
    return (
        <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${
            isScrolled 
            ? "bg-white shadow-md backdrop-blur-sm bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90" 
            : "bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900"
        }`}>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
                {/* Logo and brand name */}
                <Link
                    href="/home"
                    className="flex items-center space-x-3 group"
                >
                    <div className="relative overflow-hidden rounded-lg h-10 w-10 flex items-center justify-center bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-110">
                        <Image
                            src="/hcmueLogo.png"
                            width={36}
                            height={36}
                            alt="Community Logo"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-bold tracking-tight ${
                            isScrolled ? "text-blue-700 dark:text-white" : "text-white"
                        }`}>
                            HCMUE
                        </span>
                        <span className={`text-xs font-medium -mt-1 ${
                            isScrolled ? "text-gray-600 dark:text-gray-300" : "text-blue-100 dark:text-gray-300"
                        }`}>
                            Mạng xã hội sinh viên
                        </span>
                    </div>
                </Link>

                {/* Navigation Links - Center */}
                <div className="hidden md:flex md:order-1 md:mx-auto md:space-x-8">
                    {navigationLinks.map((item) => (
                        <Link 
                            key={item} 
                            href={`/${item.link}`}
                            className={`relative font-medium hover:text-blue-500 transition-colors group ${
                                isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white dark:text-gray-200"
                            }`}
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Right Side - User Controls */}
                <div className="flex items-center space-x-4 md:order-2">
                    {/* Notification Bell */}
                    <button className={`p-2 rounded-full hover:bg-opacity-20 ${
                        isScrolled ? "hover:bg-gray-200 dark:hover:bg-gray-700" : "hover:bg-white"
                    }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                            isScrolled ? "text-gray-700 dark:text-gray-200" : "text-white"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    
                    {/* User Avatar */}
                    <div className="relative group">
                        <UserAvatar />
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMobileMenu}
                        type="button"
                        className={`inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden ${
                            isScrolled 
                                ? "text-gray-700 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700" 
                                : "text-white hover:bg-white hover:bg-opacity-20"
                        }`}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                <div className={`w-full md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className={`mt-3 rounded-lg shadow-lg ${isScrolled ? "bg-white dark:bg-gray-800" : "bg-blue-700 dark:bg-gray-800"}`}>
                        {navigationLinks.map((item) => (
                            <Link 
                                key={item} 
                                href={`/${item.link}`}
                                className={`block px-4 py-3 text-base font-medium border-b border-gray-200 dark:border-gray-700 ${
                                    isScrolled 
                                        ? "text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" 
                                        : "text-white hover:bg-blue-800 dark:hover:bg-gray-700"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
