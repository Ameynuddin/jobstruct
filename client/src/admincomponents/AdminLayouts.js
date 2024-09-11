import React from 'react'
import Adminaside from './Sidebar'
import Adminnavbar from './Adminnavbar'
import Adminfooter from './Adminfooter'

const AdminLayouts = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-red-200">
        <Adminaside />
        <div className="p-4 xl:ml-80 bg-sky-200">
          <Adminnavbar />
          {children}
          <Adminfooter />
        </div>
      </div>
    </>
  )
}

export default AdminLayouts
