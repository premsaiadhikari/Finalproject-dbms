import React, { useMemo, useState, useEffect } from 'react'
import { students, courses, activities } from '../data/mockData'
import DashboardCard from '../components/DashboardCard'
import ProgressChart from '../components/ProgressChart'
import { api } from '../services/api'

export default function Profile(){
  const [profile, setProfile] = useState({
    fullname: localStorage.getItem('user_fullname') || 'Demo User',
    email: localStorage.getItem('user_email') || 'good@gmail.com'
  })
  const rawRole = localStorage.getItem('user_role') || '1'
  const role = (rawRole === '2' || String(rawRole).toUpperCase() === 'TEACHER' || String(rawRole).toUpperCase() === 'ROLE_TEACHER' || String(rawRole).toUpperCase() === 'FACULTY') ? '2' : '1'

  useEffect(() => {
    api.uinfo().then(res => {
      if (res && res.code === 200) {
        setProfile({
          fullname: res.fullname || localStorage.getItem('user_fullname') || 'Demo User',
          email: res.email || localStorage.getItem('user_email') || 'good@gmail.com',
          progress: res.progress || 0
        })
        if (res.fullname) localStorage.setItem('user_fullname', res.fullname)
        if (res.email) localStorage.setItem('user_email', res.email)
      }
    }).catch(err => console.error("Error loading user info in profile:", err))
  }, [])

  const me = useMemo(() => {
    const fallbackUser = students[0]
    return {
      ...fallbackUser,
      name: profile.fullname,
      email: profile.email,
      progress: profile.progress || 0
    }
  }, [profile])

  const enrolledCourses = useMemo(() => courses.map(course => ({
    ...course,
    progress: profile.progress || 0
  })), [me, profile])

  const completed = enrolledCourses.filter(c => c.progress >= 75).length
  const pending = enrolledCourses.length - completed
  const avgProgress = profile.progress || 0

  // FACULTY PROFILE VIEW
  if (role === '2') {
    const totalStudents = students.length
    const avgClassProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    const totalCoursesTeaching = courses.length

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          <div className="glass-card rounded-[36px] p-7 shadow-2xl border border-white/40 dark:border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img src="/src/assets/avatar.svg" className="w-32 h-32 rounded-full border-4 border-white shadow-xl dark:border-slate-700" />
              <div className="space-y-3">
                <div className="text-sm uppercase tracking-[0.24em] text-emerald-500">Faculty Profile</div>
                <div className="text-4xl font-bold text-slate-900 dark:text-white">Dr. {me.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{me.email}</div>
                <div className="flex gap-3 flex-wrap text-sm text-slate-600 dark:text-slate-300">
                  <span>Department: {me.department}</span>
                  <span>Last updated: {me.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card rounded-3xl p-4 text-center">
                <div className="text-sm text-slate-500">Courses Teaching</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{totalCoursesTeaching}</div>
              </div>
              <div className="glass-card rounded-3xl p-4 text-center">
                <div className="text-sm text-slate-500">Total Students</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{totalStudents}</div>
              </div>
              <div className="glass-card rounded-3xl p-4 text-center">
                <div className="text-sm text-slate-500">Class Avg Progress</div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">{avgClassProgress}%</div>
              </div>
            </div>
            <div className="mt-8">
              <div className="text-sm text-slate-500 mb-3">About</div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">An experienced educator managing courses and tracking student progress across database systems, data structures, and web development. Dedicated to fostering academic excellence and student success.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs uppercase tracking-[0.16em] rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 text-emerald-700 dark:text-emerald-200">Teaching</span>
                <span className="text-xs uppercase tracking-[0.16em] rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 text-emerald-700 dark:text-emerald-200">Mentoring</span>
                <span className="text-xs uppercase tracking-[0.16em] rounded-full bg-emerald-100 dark:bg-emerald-500/15 px-3 py-1 text-emerald-700 dark:text-emerald-200">Assessment</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <DashboardCard title="Courses Teaching" value={totalCoursesTeaching} />
            <DashboardCard title="Total Students" value={totalStudents} />
            <DashboardCard title="Class Avg Progress %" value={`${avgClassProgress}%`} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Courses Teaching</h3>
              <span className="text-sm text-slate-500">Total {courses.length}</span>
            </div>
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="rounded-3xl border border-slate-100 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-xs text-slate-500">Avg Progress: {course.progressAvg}%</div>
                    </div>
                    <div className="text-sm text-slate-500">{course.progressAvg}%</div>
                  </div>
                  <div className="mt-3 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2" style={{ width: `${course.progressAvg}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Class Overview</h3>
                <span className="text-xs text-slate-500">Live summary</span>
              </div>
              <div className="flex justify-center">
                <ProgressChart data={avgClassProgress} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Student Overview</h3>
                <span className="text-xs text-slate-500">All students</span>
              </div>
              <div className="space-y-3">
                {students.slice(0, 4).map(student => (
                  <div key={student.id} className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-3">
                    <div className="text-sm font-medium">{student.name}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // STUDENT PROFILE VIEW (default)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="glass-card rounded-[36px] p-7 shadow-2xl border border-white/40 dark:border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img src="/src/assets/avatar.svg" className="w-32 h-32 rounded-full border-4 border-white shadow-xl dark:border-slate-700" />
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-[0.24em] text-cyan-500">Student Profile</div>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{me.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{me.email}</div>
              <div className="flex gap-3 flex-wrap text-sm text-slate-600 dark:text-slate-300">
                <span>Department: {me.department}</span>
                <span>Last updated: {me.lastUpdated}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-3xl p-4 text-center">
              <div className="text-sm text-slate-500">Completed Courses</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white">{completed}</div>
            </div>
            <div className="glass-card rounded-3xl p-4 text-center">
              <div className="text-sm text-slate-500">Pending Courses</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white">{pending}</div>
            </div>
            <div className="glass-card rounded-3xl p-4 text-center">
              <div className="text-sm text-slate-500">Average Progress</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white">{avgProgress}%</div>
            </div>
          </div>
          <div className="mt-8">
            <div className="text-sm text-slate-500 mb-3">About</div>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">A dedicated learner tracking progress across database, analytics, and web development courses. The profile dashboard helps clarify goals, milestones, and current course performance.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {me.skills.map(skill => (
                <span key={skill} className="text-xs uppercase tracking-[0.16em] rounded-full bg-cyan-100 dark:bg-cyan-500/15 px-3 py-1 text-cyan-700 dark:text-cyan-200">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DashboardCard title="Completed Courses" value={completed} />
          <DashboardCard title="Pending Courses" value={pending} />
          <DashboardCard title="Average Progress %" value={`${avgProgress}%`} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Courses</h3>
            <span className="text-sm text-slate-500">Enrolled {enrolledCourses.length}</span>
          </div>
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="rounded-3xl border border-slate-100 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{course.title}</div>
                    <div className="text-xs text-slate-500">Instructor: {course.instructor}</div>
                  </div>
                  <div className="text-sm text-slate-500">{course.progress}%</div>
                </div>
                <div className="mt-3 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Progress Overview</h3>
              <span className="text-xs text-slate-500">Live summary</span>
            </div>
            <div className="flex justify-center">
              <ProgressChart data={avgProgress} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <span className="text-xs text-slate-500">Latest updates</span>
            </div>
            <div className="space-y-3">
              {activities.slice(0,4).map(item => (
                <div key={item.id} className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-3">
                  <div className="text-sm font-medium">{item.text}</div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
