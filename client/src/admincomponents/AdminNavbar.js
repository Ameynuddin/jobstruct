import React, { useEffect, useState } from 'react'
import { useData } from '../API/ApiContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoLogOutOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';


const AdminNavbar = () => {
  const { LogoutAPI, CurrentUser } = useData()
  const [currentUser, setcurrentUser] = useState([])
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
  //getCurrent User 
  const getCurrentUSer = async () => {
    try {
      const res = await CurrentUser()
      if (res.success) {
        const { data } = res;
        console.log(data)
        setcurrentUser(data.data.currentUser)

      } else {
        console.error(res.message || res.error);
      }

    } catch (error) {
      console.error('An error occurred while fetching the current user:', error);
    }
  }
  useEffect(() => {
    getCurrentUSer()
  }, [])
  console.log(`http://127.0.0.1:8080/uploads/${currentUser.avatar}`)

  return (
    <>
      <nav className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200">
        {/* search input */}
        <div className="flex items-center">
          <IoIosSearch fontSize={20} className='text-gray-400 absolute translate-x-2.5' />
          <input type="text" placeholder="Search..." className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded pl-10 pr-4' />
          {/* <button type="button">Search</button> */}
        </div>

        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverButton className="block focus:outline-none data-[active]:bg-gray-100 p-1.5 rounded">
              <IoChatboxEllipsesOutline fontSize={20} />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="absolute -translate-x-32 w-72 mt-2 rounded-sm bg-white/85 shadow-md ring-1 ring-black/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-2 data-[closed]:opacity-0"
            >
              <div className="px-3 py-2 leading-8">
                <strong className='text-gray-600 text-base'>Messages</strong>
                <p className="text-black/75">No new messages.</p>
              </div>
            </PopoverPanel>
          </Popover>

          <Popover>
            <PopoverButton className="block focus:outline-none data-[active]:bg-gray-100 p-1.5 rounded">
              <IoMdNotificationsOutline fontSize={20} />
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="absolute -translate-x-32 w-72 mt-2 rounded-sm bg-white/85 shadow-md ring-1 ring-black/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-2 data-[closed]:opacity-0"
            >
              <div className="px-3 py-2 leading-8">
                <strong className='text-gray-600 text-base'>Notifications</strong>
                <p className="text-black/75">You're all caught up!.</p>
              </div>
            </PopoverPanel>
          </Popover>

        </div>

        {/* Profile */}
        <div>
          <button
            className=""
            type="button"
          >
            <img
              crossOrigin="anonymous"
              className="w-10 h-10 rounded-full"
              // src={`http://127.0.0.1:8080/uploads/${currentUser.avatar}`}
              alt="Rounded avatar"
            />
            {currentUser.name}
          </button>
        </div>

        {/* logout */}
        <div>
          <button onClick={Logout} type="button">
            <IoLogOutOutline />
            Logout
          </button>
        </div>
      </nav>
    </>
  )
}


export default AdminNavbar
