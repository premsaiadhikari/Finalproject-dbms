import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import ModalForm from '../components/ModalForm'

export default function StudentProgress(){
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState("")

  useEffect(()=>{ 
    api.getStudents().then(setStudents)
    api.getCourses().then(data => {
      setCourses(data)
      if (data && data.length > 0) {
        setSelectedCourse(data[0].id)
      }
    })
  },[])

  const handleDeleteStudent = async (id) => {
    if(window.confirm('Are you sure you want to delete this student?')){
      try {
        await api.deleteStudent(id)
        setStudents(prev => prev.filter(s => s.id !== id))
      } catch (err) {
        alert("Failed to delete student: " + err.message)
      }
    }
  }

  const handleAssignClick = (student) => {
    setSelectedStudent(student)
    setAssignModalOpen(true)
  }

  const handleAssignSubmit = async () => {
    try {
      await api.assignCourse(selectedStudent.id, selectedCourse)
      alert(`Successfully assigned course to ${selectedStudent?.fullname || selectedStudent?.name}`)
      
      setStudents(prev => prev.map(s => {
        if (s.id === selectedStudent.id) {
          const currentCourses = s.courses ? s.courses.split(',') : []
          if (!currentCourses.includes(String(selectedCourse))) {
            currentCourses.push(String(selectedCourse))
          }
          return { ...s, courses: currentCourses.join(',') }
        }
        return s
      }))
      
      setAssignModalOpen(false)
    } catch (err) {
      alert("Failed to assign course: " + err.message)
    }
  }

  const filtered = students.filter(s => {
    const studentName = s.fullname || s.name || ''
    return studentName.toLowerCase().includes(q.toLowerCase()) && (filter === 'all' || s.department === filter)
  })

  const getCourseNames = (courseIdsString) => {
    if (!courseIdsString) return "No courses assigned"
    const ids = courseIdsString.split(',')
    const names = ids.map(id => {
      const course = courses.find(c => String(c.id) === String(id))
      return course ? course.title : `Course ${id}`
    })
    return names.join(', ')
  }

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm overflow-auto">
        <table className="w-full text-left">
          <thead><tr className="text-slate-500"><th>Name</th><th>Course</th><th>Progress</th><th>Status</th><th>Last Updated</th><th className="text-right">Actions</th></tr></thead>
          <tbody>
            {filtered.map(s=> (
              <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-3">{s.fullname || s.name}<div className="text-xs text-slate-400">{s.email}</div></td>
                <td className="text-sm font-medium text-slate-700 dark:text-slate-300">{getCourseNames(s.courses)}</td>
                <td>
                  <div className="w-40 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2" style={{width:`${s.progress}%`}}></div>
                  </div>
                </td>
                <td>{s.progress>75 ? 'Active' : 'Pending'}</td>
                <td>
                  <div>{s.lastUpdated || "N/A"}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.skills || "No skills listed"}</div>
                </td>
                <td className="text-right py-3">
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
      {/* Assign Course Modal */}
      <ModalForm open={assignModalOpen} title={`Assign Course to ${selectedStudent?.fullname || selectedStudent?.name}`} onClose={() => setAssignModalOpen(false)}>
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-200">Select Course</label>
            <select className="w-full border p-2 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              {courses.map(c => (
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
