import React from 'react'

export default function ActivityTable({ activities }){
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold mb-3">Recent Activities</h3>
      <ul className="space-y-2">
        {activities.map(a=> (
          <li key={a.id} className="text-sm text-slate-600 dark:text-slate-300">{a.text} <span className="text-xs text-slate-400">• {a.time}</span></li>
        ))}
      </ul>
    </div>
  )
}
