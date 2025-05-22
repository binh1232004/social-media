'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUserInfo, logout } from '../utils/auth';
import useUserAvatar from '../hooks/useUserAvatar';

export default function UserAvatar() {
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Use the custom hook to fetch the avatar directly from API
  const { avatarUrl, loading } = useUserAvatar();
  
  useEffect(() => {
    // Get other user info from the JWT token
    const info = getUserInfo();
    setUserInfo(info);
  }, []);
  
  const handleLogout = () => {
    logout('/signin');
  };
  
  return (
    <div className="relative">
      <button 
        className="mr-2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-blue-900 hover:ring-sky-500 bg-neutral-500"
        onClick={() => setShowDropdown(!showDropdown)}
      >        {loading ? (
          // Show a loading placeholder while fetching the avatar
          <div className="w-7 h-7 rounded-full bg-gray-300 animate-pulse"></div>
        ) : (
          <Image 
            src={avatarUrl} 
            width={30} 
            height={30} 
            alt="User Avatar" 
            className="rounded-full"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              e.target.src = '/avatar.png';
            }}
          />
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {/* <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
              {userInfo?.userId && (
                <p className="font-semibold">User ID: {userInfo.userId}</p>
              )}
            </div> */}
            <a 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Trang cá nhân
            </a>
            <button 
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
