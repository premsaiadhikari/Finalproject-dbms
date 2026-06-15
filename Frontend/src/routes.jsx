import React from 'react'
import Dashboard from './pages/Dashboard'
import StudentProgress from './pages/StudentProgress'
import CourseManagement from './pages/CourseManagement'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import CoursesAndTests from './pages/CoursesAndTests'
import Reviews from './pages/Reviews'

const routes = [
  { path: '', element: <Dashboard /> },
  { path: 'courses-tests', element: <CoursesAndTests /> },
  { path: 'students', element: <StudentProgress /> },
  { path: 'courses', element: <CourseManagement /> },
  { path: 'profile', element: <Profile /> },
  { path: 'admin', element: <AdminPanel /> },
  { path: 'reviews', element: <Reviews /> },
]

export default routes
