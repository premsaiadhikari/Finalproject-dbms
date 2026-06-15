import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import Toast from '../components/Toast'

function passwordStrength(pw) {
  let score = 0

  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  return score
}

export default function Signup() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    department: '',
    role: "student"
  })

  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const [emailExists, setEmailExists] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const [toastOpen, setToastOpen] = useState(false)

  const nav = useNavigate()

  // CHECK EMAIL
  useEffect(() => {

    if (!form.email) {
      setEmailExists(false)
      return
    }

    const t = setTimeout(async () => {

      setCheckingEmail(true)

      try {
        const exists = await api.checkEmail(form.email)
        setEmailExists(exists)
      } catch (e) {
        console.log(e)
      } finally {
        setCheckingEmail(false)
      }

    }, 400)

    return () => clearTimeout(t)

  }, [form.email])

  // SIGNUP
  const submit = async (e) => {

    e.preventDefault()

    setErr('')

    if (form.password !== form.confirm) {
      setErr('Passwords do not match')
      return
    }

    if (emailExists) {
      setErr('Email already registered')
      return
    }

    setLoading(true)

    try {

      await api.signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department,
        password: form.password,
        role: form.role
      })

      setToastOpen(true)
      setTimeout(() => {
        localStorage.setItem('user_fullname', form.name)
        localStorage.setItem('user_email', form.email)
        localStorage.setItem('user_role', String(form.role))
        nav('/')
      }, 1200)

    } catch (er) {

      console.log(er)
      setErr(er.message || 'Signup failed')

    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 relative overflow-hidden p-4">

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-[2rem] shadow-2xl shadow-indigo-500/5 p-8 relative z-10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Create account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Join us to manage your academic progress</p>
        </div>

        {err && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 text-center">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Full name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
              placeholder="john@example.com"
            />
            {/* EMAIL STATUS */}
            <div className="text-xs mt-1 pl-1">
              {checkingEmail ? (
                <span className="text-slate-400">Checking email...</span>
              ) : emailExists ? (
                <span className="text-red-500 font-medium">Email already taken</span>
              ) : form.email ? (
                <span className="text-emerald-500 font-medium">Email available</span>
              ) : null}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
                placeholder="e.g. CS"
              />
            </div>

            {/* ROLE SELECTOR */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white appearance-none"
              >
                <option value="student" className="dark:bg-slate-800">Student</option>
                <option value="faculty" className="dark:bg-slate-800">Faculty</option>
              </select>
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
              placeholder="••••••••"
            />

            {/* PASSWORD STRENGTH */}
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(passwordStrength(form.password) / 4) * 100}%`,
                      backgroundColor: passwordStrength(form.password) < 2 ? '#ef4444' : passwordStrength(form.password) < 3 ? '#eab308' : '#10b981'
                    }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider pl-1">
                  Strength: {['Very weak', 'Weak', 'Okay', 'Good', 'Strong'][passwordStrength(form.password)]}
                </div>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              required
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-slate-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* BUTTON */}
          <div className="pt-4">
            <button
              disabled={emailExists || loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Create account'}
            </button>
          </div>

          <div className="text-center pt-2">
            <a href="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Already have an account? <span className="font-medium underline decoration-indigo-500/30 underline-offset-4">Log in</span>
            </a>
          </div>

        </form>

        <Toast
          open={toastOpen}
          message={"Account created — redirecting..."}
          onClose={() => setToastOpen(false)}
        />

      </div>
    </div>
  )
}