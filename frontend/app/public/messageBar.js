'use client';
import React from "react";
import Image from "next/image";

export default function messageBar(){
    return(
        <aside id="default-sidebar" class="fixed top-16 right-2 z-40 w-72 h-full pb-16 transition-transform -translate-x-full sm:translate-x-0 border-t border-gray-200 dark:border-gray-600" aria-label="Sidebar">
   <div class="h-full px-3 py-4 hover:overflow-y-scroll py-20">
      <a href="#" class="flex justify-between items-center mb-4">
         <div class="flex cursor-text">
            <img src="/messenger.png" class="h-6 me-3 sm:h-7 " alt="Messenger Logo" />
            <span class="text-xl font-semibold whitespace-nowrap dark:text-slate-500">
               Người liên hệ
            </span>
         </div>
         <div class="flex w-9 h-9 justify-center items-center rounded-full hover:bg-blue-900 hover:ring-sky-500 cursor-pointer">
            <img src="/search.png" class="w-6 h-6"/>
         </div>
      </a>
      <ul class="space-y-2 font-medium">
         <li>
            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  src="/person.png"
               />
               <span class="flex-1 ms-3 whitespace-nowrap">Full name one</span>
               <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-red-900 dark:text-red-300">1</span>
            </a>
         </li>
         <li>
            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <img class="w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  src="/person.png"
               />
               <span class="flex-1 ms-3 whitespace-nowrap">Person two</span>
               <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-green-900 dark:text-green-300">3</span>
            </a>
         </li> 
      </ul>
      <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
         <li>
         <a href="#" class="flex items-center ps-2.5 mb-5 cursor-text">
         <img src="/group.png" class="h-6 me-3 sm:h-7" alt="Messenger Logo" />
         <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-slate-500">
            Nhóm chat
         </span>
      </a>
         </li>
         <li>
            <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
               <img class="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                  src="/ai.png"
               />
               <span class="ms-3">2024Comp1172 Sáng-T7</span>
               <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-green-900 dark:text-green-300">0</span>
            </a>
         </li>
         <li>
         <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
               <img class="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                  src="/ai.png"
               />
               <span class="ms-3">2024Comp1172 Sáng-T7</span>
               <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-red-900 dark:text-red-300">0</span>
            </a>
         </li>
         
         <li>
         <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
               <img class="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                  src="/group.png"
               />
               <span class="ms-3">Thêm nhóm chat</span>
            </a>
         </li>
      </ul>
   </div>
</aside>
    );
}