import React from 'react'

export default function ModalForm({ open, title, children, onClose }){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}
