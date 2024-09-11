import React, { useEffect, useState } from 'react'
import { useData } from '../API/ApiContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoLogOutOutline } from "react-icons/io5";

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
      <nav className="">
        <div className="">

          {/* search input */}
          <div class="">
            <input placeholder="" />
            <label>Search</label>
            <button type="button">Search</button>
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

        </div>
      </nav>
    </>
  )
}


export default AdminNavbar
