import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Star, MessageSquare, CheckCircle } from 'lucide-react'

export default function Reviews() {
  const [role, setRole] = useState('1')
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  
  // Student view state
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Teacher view state
  const [progressUpdates, setProgressUpdates] = useState({})
  
  const username = localStorage.getItem('user_fullname') || 'Anonymous'

  useEffect(() => {
    const rawRole = localStorage.getItem('user_role') || '1'
    const currentRole = (rawRole === '2' || String(rawRole).toUpperCase() === 'TEACHER' || String(rawRole).toUpperCase() === 'ROLE_TEACHER' || String(rawRole).toUpperCase() === 'FACULTY') ? '2' : '1'
    setRole(currentRole)

    if (currentRole === '2') {
      // Teacher view: load students and courses
      api.getStudents().then(setStudents)
      api.getCourses().then(setCourses)
    } else {
      // Student view: load teachers
      api.getTeachers().then(data => {
        setTeachers(data)
        if (data.length > 0) setSelectedTeacher(data[0].fullname || data[0].name)
      })
    }
  }, [])

  const getCourseNames = (courseIdsString) => {
    if (!courseIdsString) return "No courses assigned"
    const ids = courseIdsString.split(',')
    const names = ids.map(id => {
      const course = courses.find(c => String(c.id) === String(id))
      return course ? course.title : `Course ${id}`
    })
    return names.join(', ')
  }

  const handleProgressChange = (studentId, value) => {
    setProgressUpdates({
      ...progressUpdates,
      [studentId]: value
    })
  }

  const handleUpdateProgress = async (studentId) => {
    const newProgress = progressUpdates[studentId]
    if (newProgress === undefined) return
    
    try {
      await api.updateProgress(studentId, parseInt(newProgress))
      // Update local state to reflect change visually
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, progress: parseInt(newProgress) } : s))
      alert('Progress updated successfully!')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!selectedTeacher) return alert("Please select a teacher")

    setSubmitting(true)
    try {
      const newReview = { username, teacherName: selectedTeacher, rating, comment }
      await api.submitReview(newReview)
      setComment('')
      setRating(5)
      alert("Review submitted successfully!")
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ================= TEACHER VIEW =================
  if (role === '2') {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-[32px] p-6 shadow-md border border-white/40 dark:border-slate-700/50 bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-transparent">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={32} />
            Update Student Progress
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Review your students and manually update their percentage completed for their assigned subjects.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm overflow-auto border border-slate-100 dark:border-slate-700">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100 dark:border-slate-700/60">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Assigned Subjects</th>
                <th className="pb-3">Current Progress</th>
                <th className="pb-3">Update Progress (%)</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {s.fullname || s.name}
                    <div className="text-xs text-slate-400 font-normal">{s.email}</div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 dark:text-slate-300">
                    {getCourseNames(s.courses)}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2" style={{ width: `${s.progress || 0}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <input 
                      type="number" 
                      min="0" max="100"
                      className="w-20 border rounded p-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      placeholder={s.progress || "0"}
                      value={progressUpdates[s.id] !== undefined ? progressUpdates[s.id] : ''}
                      onChange={(e) => handleProgressChange(s.id, e.target.value)}
                    />
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleUpdateProgress(s.id)}
                      disabled={progressUpdates[s.id] === undefined || progressUpdates[s.id] === ''}
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ================= STUDENT VIEW =================
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-[32px] p-6 shadow-md border border-white/40 dark:border-slate-700/50 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Star className="text-amber-500" size={32} />
          Review Your Teacher
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Leave a rating and write feedback for your teachers to help them improve their subjects.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <form onSubmit={handleReviewSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">Select Teacher</label>
            <select 
              value={selectedTeacher} 
              onChange={e => setSelectedTeacher(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500/50 outline-none text-slate-900 dark:text-white"
            >
              {teachers.length === 0 && <option value="">No teachers available</option>}
              {teachers.map(t => (
                <option key={t.id} value={t.fullname || t.name}>{t.fullname || t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">Star Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-slate-200">Feedback (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like about their teaching? What could be improved?"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-amber-500/50 outline-none text-slate-900 dark:text-white min-h-[150px]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedTeacher}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  )
}
