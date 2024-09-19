import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { FaSuitcase } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa6";
import { useData } from '../API/ApiContext'

function NavButton({ to, icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`
          font-bold transition-all 
          disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none 
          text-xs py-3 rounded-lg w-full flex items-center gap-4 px-4 capitalize
          ${isActive
            ? 'text-white bg-white/10'
            : 'text-white/50 hover:bg-white/10 active:bg-white/30'}
        `}
        type="button"
      >
        {icon}
        <p className="block antialiased text-base leading-relaxed text-inherit font-medium capitalize">
          {label}
        </p>
      </button>
    )
  }
  
  return (
    <Link to={to} className={isActive ? 'active' : ''}>
      <button
        className={`
          font-bold transition-all 
          disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none 
          text-xs py-3 rounded-lg w-full flex items-center gap-4 px-4 capitalize
          ${isActive
            ? 'text-white bg-white/10'
            : 'text-white/50 hover:bg-white/10 active:bg-white/30'}
        `}
        type="button"
      >
        {icon}
        <p className="block antialiased text-base leading-relaxed text-inherit font-medium capitalize">
          {label}
        </p>
      </button>
    </Link>
  );
}

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // logout
  const { LogoutAPI } = useData()

  const Logout = async () => {
    const res = await LogoutAPI();
    if (res.success) {
      toast.success("User logout successfully", {
        position: "top-center"
      });
    } else {
      toast.error("Logout failed", {
        position: "top-center"
      })
      console.log('Logout failed: ' + res.error || res.message);
    }
  };

  return (
    <>
      <aside className={`bg-gradient-to-br from-gray-800 to-gray-900 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-80'} xl:translate-x-0`}>

        <div className="relative border-b border-white/20">
          <a className="flex items-center gap-4 py-6 px-8" href="/adminhome">
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white text-center">JobStruct</h6>
          </a>

          <button
            onClick={toggleSidebar}
            className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
            type="button"
          >
            <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true" className="h-5 w-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </span>
          </button>
        </div>

        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-1">
            <li>
              <NavButton
                to="/adminhome"
                label="dashboard"
                icon={<MdSpaceDashboard fontSize={20} />}
              />
            </li>

            <li>
              <NavButton
                to="/addjob"
                label="Add Job"
                icon={<IoIosAddCircle fontSize={20} />}
              />
            </li>

            <li>
              <NavButton
                to="/alljob"
                label="All Jobs"
                icon={<FaSuitcase fontSize={20} />}
              />
            </li>
          </ul>

          <ul className="mb-4 flex flex-col gap-1">
            <li className="mx-3.5 mt-4 mb-2">
              <p className="block antialiased text-sm leading-normal text-white font-black uppercase opacity-75">Setting</p>
            </li>
            <li>
              <NavButton
                to="/updateprofile"
                label="Profile"
                icon={<FaUser fontSize={20} />
                }
              />
            </li>
            <li>
              <NavButton
                onClick="{Logout}"
                label="Sign Out"
                icon={<FaPowerOff fontSize={20} className='text-red-400' />}
              />
            </li>

          </ul>
        </div>
      </aside>

      {isSidebarOpen ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={toggleSidebar}
        ></div>
      ) : (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 xl:hidden p-2 bg-gray-800 rounded-md"
        >
          <IoMenu color='white' />
        </button>
      )}
    </>
  )
}

export default Sidebar;