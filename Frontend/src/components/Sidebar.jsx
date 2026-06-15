import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, BookOpen, Settings, PieChart, MessageSquare } from 'lucide-react'

const items = [
  { to: '/', label:'Dashboard', icon: <Home size={16}/> },
  { to: '/courses-tests', label:'Courses & Tests', icon: <BookOpen size={16}/> },
  { to: '/students', label:'Students', icon: <Users size={16}/> },
  { to: '/courses', label:'Courses', icon: <BookOpen size={16}/> },
  { to: '/reviews', label:'Reviews', icon: <MessageSquare size={16}/> },
  { to: '/admin', label:'Admin', icon: <PieChart size={16}/> },
  { to: '/profile', label:'Profile', icon: <Settings size={16}/> },
]

export default function Sidebar(){
  const loc = useLocation()
  const rawRole = localStorage.getItem('user_role') || '1'
  const role = (rawRole === '2' || String(rawRole).toUpperCase() === 'TEACHER' || String(rawRole).toUpperCase() === 'ROLE_TEACHER' || String(rawRole).toUpperCase() === 'FACULTY') ? '2' : '1'
  console.log("DEBUG: Sidebar.jsx reading user_role:", role)

  const allowedItems = items.filter(item => {
    if (role === '1') {
      return item.to === '/' || item.to === '/courses-tests' || item.to === '/profile' || item.to === '/reviews'
    }
    if (role === '2') {
      return item.to === '/' || item.to === '/students' || item.to === '/courses' || item.to === '/profile' || item.to === '/reviews'
    }
    return true
  })

  return (
    <aside className="w-72 bg-slate-950/90 dark:bg-slate-950 border-r border-slate-900 p-6 hidden xl:block">
      <div className="mb-8 pb-4 border-b border-slate-800">
        <div className="text-2xl font-bold text-white">LearnTrack</div>
        <div className="text-sm text-slate-400 mt-1">Student progress hub</div>
      </div>
      <nav className="space-y-2">
        {allowedItems.map(i=> (
          <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-3 rounded-3xl transition ${loc.pathname===i.to ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
            <span className="p-2 rounded-2xl bg-slate-800 text-slate-300">{i.icon}</span>
            <span>{i.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-10 p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg text-slate-200">
        <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Upgrade ready</div>
        <div className="mt-3 text-sm">Use the dashboard to track courses and student progress with analytics at a glance.</div>
      </div>
    </aside>
  )
}
