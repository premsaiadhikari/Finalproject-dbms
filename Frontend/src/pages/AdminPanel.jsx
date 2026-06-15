import React, { useMemo, useState } from 'react'
import { students as initialStudents, courses as initialCourses } from '../data/mockData'

export default function AdminPanel(){
  const [students, setStudents] = useState(initialStudents)
  const [courses, setCourses] = useState(initialCourses)
  const [newStudent, setNewStudent] = useState({ name:'', email:'', department:'CS' })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedCourseIds, setSelectedCourseIds] = useState([])

  const stats = useMemo(()=>({
    totalStudents: students.length,
    totalCourses: courses.length,
    assignedCount: courses.reduce((sum,c)=> sum + (c.assignedStudents?.length||0), 0),
    avgProgress: students.length ? Math.round(students.reduce((sum,s)=>sum+s.progress,0)/students.length) : 0,
  }),[students,courses])

  const addStudent = (e)=>{
    e.preventDefault()
    setStudents(prev => [...prev, { id: Date.now(), name: newStudent.name, email: newStudent.email, department: newStudent.department, skills: [], progress: 0, lastUpdated: new Date().toISOString().slice(0,10) }])
    setNewStudent({ name:'', email:'', department:'CS' })
  }

  const removeStudent = (id)=>{
    if(!window.confirm('Remove selected student?')) return
    setStudents(prev => prev.filter(s=> s.id !== id))
    setCourses(prev => prev.map(c => ({ ...c, assignedStudents: (c.assignedStudents || []).filter(sid=> sid !== id) })))
  }

  const toggleCourseSelect = (cid)=>{
    setSelectedCourseIds(prev => prev.includes(cid) ? prev.filter(id=>id!==cid) : [...prev,cid])
  }

  const assignCourses = ()=>{
    if(!selectedStudent) return
    setCourses(prev => prev.map(c => selectedCourseIds.includes(c.id) ? { ...c, assignedStudents: [...new Set([...(c.assignedStudents||[]), selectedStudent.id])] } : c))
    setSelectedCourseIds([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Students</div>
          <div className="text-3xl font-semibold mt-2">{stats.totalStudents}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Courses</div>
          <div className="text-3xl font-semibold mt-2">{stats.totalCourses}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Total Assignments</div>
          <div className="text-3xl font-semibold mt-2">{stats.assignedCount}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">Avg Progress</div>
          <div className="text-3xl font-semibold mt-2">{stats.avgProgress}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Add Student</h3>
          <form onSubmit={addStudent} className="space-y-3">
            <div>
              <label className="block text-sm">Name</label>
              <input value={newStudent.name} onChange={e=>setNewStudent({...newStudent, name:e.target.value})} className="w-full border rounded p-2 bg-transparent" required />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="email" value={newStudent.email} onChange={e=>setNewStudent({...newStudent, email:e.target.value})} className="w-full border rounded p-2 bg-transparent" required />
            </div>
            <div>
              <label className="block text-sm">Department</label>
              <input value={newStudent.department} onChange={e=>setNewStudent({...newStudent, department:e.target.value})} className="w-full border rounded p-2 bg-transparent" />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded">Add student</button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Assign Courses</h3>
          <div className="mb-3">
            <select value={selectedStudent?.id||''} onChange={e=>setSelectedStudent(students.find(s=>s.id===Number(e.target.value)))} className="w-full border rounded p-2 bg-transparent">
              <option value="">Select student</option>
              {students.map(student => <option key={student.id} value={student.id}>{student.name}</option>)}
            </select>
          </div>
          <div className="space-y-2 max-h-40 overflow-auto mb-3">
            {courses.map(course => (
              <label key={course.id} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedCourseIds.includes(course.id)} onChange={()=>toggleCourseSelect(course.id)} />
                <span>{course.title}</span>
              </label>
            ))}
          </div>
          <button disabled={!selectedStudent || selectedCourseIds.length===0} onClick={assignCourses} className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50">Assign courses</button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Reports</h3>
          <div className="text-sm text-slate-500">Departments</div>
          <ul className="space-y-2 mt-2 text-sm">
            {Array.from(new Set(students.map(s=>s.department))).map(dep => (
              <li key={dep}>{dep}: {students.filter(s=>s.department===dep).length} student(s)</li>
            ))}
          </ul>
          <div className="mt-4 text-sm text-slate-500">Course Assignment Load</div>
          <ul className="space-y-2 mt-2 text-sm">
            {courses.map(course => (
              <li key={course.id}>{course.title}: {(course.assignedStudents||[]).length} assigned</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Remove Students</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {students.map(student => (
            <div key={student.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div>
                <div className="font-medium">{student.name}</div>
                <div className="text-xs text-slate-500">{student.email}</div>
              </div>
              <button onClick={()=>removeStudent(student.id)} className="text-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
