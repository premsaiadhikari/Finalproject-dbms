import React, { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { activities } from '../data/mockData'

export default function Notifications(){
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(()=>{
    function onDoc(e){
      if(ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  },[])

  const unread = activities.length

  return (
    <div className="relative" ref={ref}>
      <button onClick={(e)=>{e.stopPropagation(); setOpen(o=>!o)}} className="relative p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
        <Bell size={18} />
        {unread>0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">{unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 font-semibold">Notifications</div>
          <div className="p-3 max-h-60 overflow-auto">
            {activities.map(a=> (
              <div key={a.id} className="py-2 border-b last:border-b-0 border-slate-100 dark:border-slate-700">
                <div className="text-sm">{a.text}</div>
                <div className="text-xs text-slate-400">{a.time}</div>
              </div>
            ))}
          </div>
          <div className="p-2 text-center text-sm text-primary hover:bg-slate-50 cursor-pointer">Mark all as read</div>
        </div>
      )}
    </div>
  )
}
