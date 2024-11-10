'use client';
import React from "react";
import Image from "next/image";

export default function NavBar(){
  return(
    <nav class="fixed bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse ml-4">
          <Image 
            src="/community.png" 
            width={40} height={40} alt="community_logo"
          />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Social network
          </span>
        </a>
        <div class="flex md:order-2">
          <button className="mr-2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-blue-900 hover:ring-sky-500 bg-neutral-500">
            <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
              <Image src={"/menu.png"} width={25} height={25}/>
            </a>
          </button>
          <button className="mr-2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-blue-900 hover:ring-sky-500 bg-neutral-500">
            <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
              <Image src={"/messenger.png"} width={25} height={25}/>
            </a>
          </button>
          <button className="mr-2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-blue-900 hover:ring-sky-500 bg-neutral-500">
            <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
              <Image src={"/bell.png"} width={25} height={25}/>
            </a>
          </button>
          <button className="mr-2 w-10 h-10 rounded-full flex justify-center items-center hover:bg-blue-900 hover:ring-sky-500 bg-neutral-500">
            <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
              <Image src={"/avatar.png"} width={30} height={30}/>
            </a>
          </button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className="cursor-pointer w-20 h-12 rounded-lg flex justify-center items-center hover:bg-sky-500 hover:ring-sky-500">
              <a href="#" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">
                <Image src={"/home.png"} width={30} height={30}/>
              </a>
            </li>
            <li className="cursor-pointer w-20 h-12 rounded-lg flex justify-center items-center hover:bg-sky-500 hover:ring-sky-500">
              <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              <Image src={"/friends.png"} width={30} height={30}/>
              </a>
            </li>
            <li className="cursor-pointer w-20 h-12 rounded-lg flex justify-center items-center hover:bg-sky-500 hover:ring-sky-500">
              <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              <Image src={"/watch.png"} width={30} height={30}/>
              </a>
            </li>
            <li className="cursor-pointer w-20 h-12 rounded-lg flex justify-center items-center hover:bg-sky-500 hover:ring-sky-500">
              <a href="#" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
              <Image src={"/group.png"} width={30} height={30}/>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}