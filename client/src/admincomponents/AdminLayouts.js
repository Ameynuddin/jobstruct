import React from 'react'
import Adminaside from './Sidebar'
import Adminnavbar from './Adminnavbar'
import Adminfooter from './Adminfooter'

const AdminLayouts = ({ children }) => {
  return (
    <>
      <div class="min-h-screen bg-gray-50/50">
        <Adminaside />
        <div class="p-4 xl:ml-80">
          <Adminnavbar />
          {children}
          <Adminfooter />
        </div>
      </div>
    </>
  )
}

export default AdminLayouts
