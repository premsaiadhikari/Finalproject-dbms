import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle(){
  const [dark, setDark] = useState(false)

  useEffect(()=>{
    const saved = localStorage.getItem('lpt_theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = saved ? saved === 'dark' : prefersDark
    setDark(initial)
    if(initial) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  },[])

  const toggle = ()=>{
    const next = !dark
    setDark(next)
    localStorage.setItem('lpt_theme', next ? 'dark' : 'light')
    if(next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  return (
    <button onClick={toggle} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
