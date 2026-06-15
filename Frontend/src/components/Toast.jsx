import React, { useEffect } from 'react'

export default function Toast({ message, open, onClose }){
  useEffect(()=>{
    if(!open) return
    const t = setTimeout(()=> onClose && onClose(), 1800)
    return ()=> clearTimeout(t)
  },[open])

  if(!open) return null
  return (
    <div className="fixed right-4 bottom-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 rounded shadow-lg">
      {message}
    </div>
  )
}
