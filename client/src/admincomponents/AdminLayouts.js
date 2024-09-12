import React from 'react'
import Adminaside from './Sidebar'
import AdminNavbar from './AdminNavbar'
import AdminFooter from './AdminFooter'

const AdminLayouts = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-red-200">
        <Adminaside />
        <div className="p-4 xl:ml-80 bg-sky-200">
          <AdminNavbar />
          {children}
          <AdminFooter />
        </div>
      </div>
    </>
  )
}

export default AdminLayouts
