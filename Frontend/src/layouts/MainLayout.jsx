import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

export default function MainLayout({ onLogout }){
  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_top_left,_rgba(108,92,231,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_20%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_20%),linear-gradient(180deg,#020617_0%,#111827_100%)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={onLogout} />
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
