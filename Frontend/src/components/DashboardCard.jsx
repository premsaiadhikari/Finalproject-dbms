import React from 'react'

export default function DashboardCard({ title, value, children }){
  return (
    <div className="glass-card rounded-[28px] p-5 shadow-xl border border-white/40 dark:border-slate-700/50 hover:shadow-2xl transition">
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className="text-3xl font-semibold mt-3 text-slate-900 dark:text-slate-100">{value}</div>
      {children && <div className="mt-3 text-slate-500">{children}</div>}
    </div>
  )
}
