import React, { useEffect, useState } from 'react'
import { useData } from '../API/ApiContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link } from 'react-router-dom';
import { IoLogOutOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import { Popover, PopoverButton, PopoverPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FaUserCircle } from "react-icons/fa";


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
  const getCurrentUser = async () => {
    try {
      const res = await CurrentUser()
      if (res.success) {
        const { data } = res;
        console.log(data)
        const name = data.data.currentUser.name;
        const initials = getInitials(name);
        setcurrentUser(initials);
      } else {
        console.error(res.message || res.error);
      }

    } catch (error) {
      console.error('An error occurred while fetching the current user:', error);
    }
  }

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const first_letter = nameParts[0].substring(0, 1).toUpperCase();

    if (nameParts.length > 1) {
      first_letter += nameParts[nameParts.length - 1].substring(0, 1).toUpperCase();
    }

    return first_letter;
  }

  useEffect(() => {
    getCurrentUser()
  }, [])
  // console.log(`http://127.0.0.1:8080/uploads/${currentUser.avatar}`)

  return (
    <div className='w-full overflow-x-hidden'>
      <nav className="relative flex flex-row h-16 items-center justify-between">
        {/* search input */}
        <div className="flex items-center pl-12">
          <IoIosSearch fontSize={20} className='text-gray-400 absolute translate-x-2.5' />
          <input type="text" placeholder="Search..." className='text-sm focus:outline-none active:outline-none h-10 w-[8rem] md:w-[24rem] border border-gray-300 rounded pl-10 pr-4' />
          {/* <button type="button">Search</button> */}
        </div>

        <div className='flex items-center gap-1'>
          {/* Messages */}
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

          {/* Notifications */}
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

          {/* Profile */}
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-200 py-1.5 px-2 text-sm/6 text-gray-800 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-100 data-[open]:bg-gray-100 data-[focus]:outline-1 data-[focus]:outline-white">
              {/* <img
                crossOrigin="anonymous"
                className="w-10 h-10 rounded-full"
                // src={`http://127.0.0.1:8080/uploads/${currentUser.avatar}`}
                alt="Rounded avatar"
              /> */}
              <FaUserCircle fontSize={20} />
              {currentUser}
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="w-52 origin-top-right rounded-xl border border-white/5 bg-gray-100/80 p-1 text-sm/6 text-black/90 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <Link to='/updateprofile' className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/85">
                  <button>
                    Profile
                  </button>
                </Link>
              </MenuItem>
              <MenuItem>
                <button onClick={Logout} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/85">
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* logout */}
          {/* <div>
          <button onClick={Logout} type="button">
            <IoLogOutOutline />
            Logout
          </button>
        </div> */}

        </div>


      </nav>
    </div>
  )
}


export default AdminNavbar
