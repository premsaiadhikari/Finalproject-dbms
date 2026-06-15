import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from './routes'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'

export default function App(){
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem('lpt_auth') === '1')

  const login = ()=>{
    localStorage.setItem('lpt_auth','1')
    setAuthenticated(true)
  }

  const logout = ()=>{
    localStorage.removeItem('lpt_auth')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_fullname')
    localStorage.removeItem('user_email')
    localStorage.removeItem('token')
    setAuthenticated(false)
  }

  const rawRole = localStorage.getItem('user_role') || '1'
  const role = (rawRole === '2' || String(rawRole).toUpperCase() === 'TEACHER' || String(rawRole).toUpperCase() === 'ROLE_TEACHER' || String(rawRole).toUpperCase() === 'FACULTY') ? '2' : '1'
  console.log("DEBUG: App.jsx reading user_role from localStorage:", role)
  const filteredRoutes = routes.filter(r => {
    if (role === '1') {
      // Students can only access Dashboard (''), Profile ('profile'), Courses & Tests ('courses-tests'), and Reviews ('reviews')
      return r.path === '' || r.path === 'profile' || r.path === 'courses-tests' || r.path === 'reviews'
    }
    if (role === '2') {
      // Teachers can only access Dashboard (''), Profile ('profile'), Students ('students'), Courses ('courses'), and Reviews ('reviews')
      return r.path === '' || r.path === 'profile' || r.path === 'students' || r.path === 'courses' || r.path === 'reviews'
    }
    return true
  })

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={authenticated ? <MainLayout onLogout={logout} /> : <Navigate to="/login" />}>
        {filteredRoutes.map(r=> <Route key={r.path} path={r.path} element={r.element} />)}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
