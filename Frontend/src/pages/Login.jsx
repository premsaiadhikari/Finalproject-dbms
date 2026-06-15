import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Login({ onLogin }){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading]=useState(false)
  const [error,setError] = useState('')
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login(email,password)
      onLogin()
      nav('/')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_20%),linear-gradient(180deg,#e2e8f0_0%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_20%),linear-gradient(180deg,#020617_0%,#111827_100%)]">
      <div className="w-full max-w-md glass-card rounded-[32px] border border-white/40 dark:border-slate-700/50 shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="text-sm uppercase tracking-[0.3em] text-cyan-500">Student Portal</div>
          <h2 className="text-3xl font-bold mt-3">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Login to continue tracking your learning progress.</p>
        </div>
        
        {error && (
          <div className="text-sm font-medium text-red-500 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-2.5 rounded-2xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300">Email</label>
            <input required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 px-4 py-3 bg-white/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-300">Password</label>
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-700 px-4 py-3 bg-white/80 dark:bg-slate-950 text-slate-900 dark:text-slate-100" placeholder="••••••" />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <a className="hover:text-primary">Forgot Password?</a>
            <button className="btn-primary rounded-full px-5 py-3">{loading ? 'Signing...' : 'Login'}</button>
          </div>
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don’t have an account? <a href="/signup" className="text-primary font-semibold">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  )
}
