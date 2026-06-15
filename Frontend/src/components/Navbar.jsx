import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Notifications from './Notifications'
import { api } from '../services/api'

export default function Navbar({ onLogout }){
  const [fullname, setFullname] = useState(localStorage.getItem('user_fullname') || 'Demo User')

  useEffect(() => {
    api.uinfo().then(res => {
      if (res && res.code === 200 && res.fullname) {
        setFullname(res.fullname)
        localStorage.setItem('user_fullname', res.fullname)
      }
    }).catch(err => console.error("Error loading user info in navbar:", err))
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-4 rounded-b-[32px] shadow-sm glass-card backdrop-blur-xl mx-4 mt-4">
      <div className="flex items-center gap-4">
        <button className="md:hidden px-3 py-2 rounded-2xl btn-secondary">Menu</button>
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Welcome back</div>
          <h1 className="text-xl font-semibold">Learning Progress Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Notifications />
        <div className="flex items-center gap-3 rounded-3xl bg-slate-100 dark:bg-slate-900 px-3 py-2 shadow-sm">
          <img src="/src/assets/avatar.svg" alt="avatar" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" />
          <div className="text-sm leading-5">
            <div className="font-medium">{fullname}</div>
            <button onClick={onLogout} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white">Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}
