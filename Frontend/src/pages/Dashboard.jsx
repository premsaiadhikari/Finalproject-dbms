import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import DashboardCard from '../components/DashboardCard'
import ProgressChart from '../components/ProgressChart'
import ActivityTable from '../components/ActivityTable'
import ModalForm from '../components/ModalForm'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip)

export default function Dashboard(){
  const [data,setData] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState("")

  const [teachers, setTeachers] = useState([])

  useEffect(()=>{ 
    api.getDashboard().then(setData) 
    api.uinfo().then(res => setUserInfo(res?.code === 200 ? res : null))
    api.getTeachers().then(setTeachers)
  },[])

  const handleDeleteStudent = async (id) => {
    if(window.confirm('Are you sure you want to delete this student?')){
      try {
        await api.deleteStudent(id)
        setData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== id) }))
      } catch (err) {
        alert("Failed to delete student: " + err.message)
      }
    }
  }

  const handleAssignClick = (student) => {
    setSelectedStudent(student)
    if(data.courses?.length){
      setSelectedCourse(data.courses[0].id)
    }
    setAssignModalOpen(true)
  }

  const handleAssignSubmit = async () => {
    try {
      await api.assignCourse(selectedStudent.id, selectedCourse)
      alert(`Successfully assigned course to ${selectedStudent?.fullname || selectedStudent?.name}`)
      setAssignModalOpen(false)
    } catch (err) {
      alert("Failed to assign course: " + err.message)
    }
  }

  const rawRole = localStorage.getItem('user_role') || '1'
  const role = (rawRole === '2' || String(rawRole).toUpperCase() === 'TEACHER' || String(rawRole).toUpperCase() === 'ROLE_TEACHER' || String(rawRole).toUpperCase() === 'FACULTY') ? '2' : '1'
  const fullname = localStorage.getItem('user_fullname') || 'Demo User'
  const email = localStorage.getItem('user_email') || 'student@example.com'
  console.log("DEBUG: Dashboard.jsx reading user_role:", role, "fullname:", fullname, "email:", email)

  if(!data) return <div className="p-6 text-center text-slate-500">Loading learning assets...</div>

  // STUDENT DASHBOARD DATA PREPARATION (FROM LOCAL STORAGE)
  const coursesKey = `user_courses_${email}`
  const testsKey = `user_tests_${email}`
  const savedCourses = localStorage.getItem(coursesKey)
  
  const studentCourses = (savedCourses ? JSON.parse(savedCourses) : data.courses.slice(0, 3)).map((c, idx) => {
    const teacher = teachers[c.id % Math.max(1, teachers.length)]
    return {
      ...c,
      progress: userInfo?.progress || 0,
      instructor: teacher ? (teacher.fullname || teacher.name) : c.instructor
    }
  })

  const savedTests = localStorage.getItem(testsKey)
  const completedQuizzes = savedTests ? JSON.parse(savedTests) : {}
  const completedQuizCount = Object.keys(completedQuizzes).length

  const studentCompletedCount = studentCourses.filter(c => c.progress >= 75).length
  const studentPendingCount = studentCourses.length - studentCompletedCount
  const studentAvgProgress = userInfo?.progress || 0

  const studentActivities = [
    { id: 1, text: `Completed ${completedQuizCount} course quiz assessments`, time: "Just now" },
    { id: 2, text: "Submitted Database Systems Assignment 2", time: "2 hours ago" },
    { id: 3, text: "Completed React Components video module", time: "1 day ago" },
    { id: 4, text: "Enrolled in Java Spring Boot REST APIs", time: "5 days ago" }
  ]

  // TEACHER DASHBOARD DATA PREPARATION
  const classAvgProgress = Math.round(data.students.reduce((s, x) => s + x.progress, 0) / data.students.length)
  const totalTeacherCourses = data.courses.length
  const classWeeklyActivity = {
    labels: data.weekly.labels,
    datasets: [{ label: 'Student Weekly Practice (Hours)', data: data.weekly.data, borderColor: '#0EA5E9', backgroundColor: 'rgba(14, 165, 233, 0.1)' }]
  }

  // ADMIN DASHBOARD PREPARATION
  const weekly = {
    labels: data.weekly.labels,
    datasets: [{ label:'Activity', data: data.weekly.data, borderColor:'#6C5CE7', backgroundColor:'#6C5CE722' }]
  }
  const totalCourses = data.courses.length
  const completed = Math.round(data.students.reduce((s,x)=>s+x.progress,0)/data.students.length)

  // ==================== RENDERING STUDENT VIEW ====================
  if (role === '1') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="glass-card rounded-[32px] p-6 shadow-md border border-white/40 dark:border-slate-700/50 bg-gradient-to-r from-indigo-500/10 via-sky-500/5 to-transparent">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Hello, {fullname}! 👋</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome to your learning dashboard. You are doing great this week — keep up the fantastic progress!</p>
        </div>

        {/* Dynamic Personal Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard title="My Courses" value={studentCourses.length} />
          <DashboardCard title="Quizzes Taken" value={completedQuizCount} />
          <DashboardCard title="In Progress" value={studentPendingCount} />
          <DashboardCard title="My Avg Progress" value={`${studentAvgProgress}%`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Course Progress */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">My Current Courses</h3>
            <div className="space-y-4">
              {studentCourses.map(course => (
                <div key={course.id} className="rounded-2xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{course.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Instructor: {course.instructor}</div>
                    </div>
                    <div className="text-sm font-semibold text-primary">{course.progress}%</div>
                  </div>
                  <div className="mt-3 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 transition-all duration-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Hour Analytics & Activity */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-3">Overall Completion Percentage</h3>
              <div className="flex justify-center">
                <ProgressChart data={studentAvgProgress} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-3">My Recent Activity</h3>
              <div className="space-y-3">
                {studentActivities.map(item => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 text-xs">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.text}</div>
                    <div className="text-slate-400 mt-1">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== RENDERING TEACHER VIEW ====================
  if (role === '2') {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="glass-card rounded-[32px] p-6 shadow-md border border-white/40 dark:border-slate-700/50 bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-transparent">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Welcome back, Professor {fullname}! 🏫</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Manage your course catalog, track students under your supervision, and assess learning analytics.</p>
        </div>

        {/* Teacher Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DashboardCard title="Students Under Me" value={data.students.length} />
          <DashboardCard title="Active Courses" value={totalTeacherCourses} />
          <DashboardCard title="Class Avg Progress" value={`${classAvgProgress}%`} />
          <DashboardCard title="Submissions Pending" value="4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Performance Roster */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Assigned Students</h3>
              <span className="text-xs bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-3 py-1 rounded-full font-bold">Class Roster</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/60 pb-2">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Overall Progress</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map(s => (
                  <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{s.fullname || s.name}</div>
                      <div className="text-xs text-slate-400">{s.email}</div>
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-300">{s.department}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2" style={{ width: `${s.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.progress >= 70 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                        {s.progress >= 70 ? 'On Track' : 'Needs Review'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleAssignClick(s)} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40 transition">Assign</button>
                        <button onClick={() => handleDeleteStudent(s.id)} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/40 transition">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Class Activity Stream & Charts */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-3">Overall Performance</h3>
              <div className="flex justify-center">
                <ProgressChart data={classAvgProgress} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-semibold mb-3">Recent Class Activity</h3>
              <div className="space-y-3">
                {data.activities.map(item => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 text-xs">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.text}</div>
                    <div className="text-slate-400 mt-1">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Assign Course Modal */}
        <ModalForm open={assignModalOpen} title={`Assign Course to ${selectedStudent?.fullname || selectedStudent?.name}`} onClose={() => setAssignModalOpen(false)}>
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-200">Select Course</label>
              <select className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                {data.courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setAssignModalOpen(false)} className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">Cancel</button>
              <button onClick={handleAssignSubmit} className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-indigo-600 transition">Assign</button>
            </div>
          </div>
        </ModalForm>
      </div>
    )
  }

  // ==================== RENDERING ADMIN VIEW ====================
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Courses" value={totalCourses} />
        <DashboardCard title="Completed Courses" value={Math.round(totalCourses*0.6)} />
        <DashboardCard title="Pending Courses" value={Math.round(totalCourses*0.4)} />
        <DashboardCard title="Avg Progress %" value={`${completed}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Weekly Activity (All Students)</h3>
          <Line data={weekly} />
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Progress</h3>
            <ProgressChart data={completed} />
          </div>
          <ActivityTable activities={data.activities} />
        </div>
      </div>
    </div>
  )
}
