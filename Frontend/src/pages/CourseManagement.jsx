import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import CourseCard from '../components/CourseCard'
import ModalForm from '../components/ModalForm'
import Loader from '../components/Loader'

export default function CourseManagement(){
  const [courses,setCourses] = useState([])
  const [open,setOpen] = useState(false)
  const [editing,setEditing] = useState(null)
  const [query,setQuery] = useState('')
  const [assigning, setAssigning] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ Promise.all([api.getCourses(), api.getStudents()]).then(([c,s])=>{ setCourses(c); setStudents(s); setLoading(false) }) },[])

  const add = (e)=>{
    e.preventDefault()
    const form = e.target
    const title = form.title.value
    setCourses(prev=>[...prev,{ id:Date.now(), title, instructor: form.instructor.value, progressAvg:0, assignedStudents: [] }])
    setOpen(false)
  }

  const startEdit = (course)=>{
    setEditing(course)
    setOpen(true)
  }

  const saveEdit = (e)=>{
    e.preventDefault()
    const form = e.target
    const title = form.title.value
    const instructor = form.instructor.value
    setCourses(prev=> prev.map(c=> c.id===editing.id ? {...c, title, instructor } : c))
    setEditing(null)
    setOpen(false)
  }

  const remove = (course)=>{
    if(!window.confirm(`Delete course "${course.title}"?`)) return
    setCourses(prev=> prev.filter(c=> c.id!==course.id))
  }

  const openAssign = (course)=>{
    setAssigning({ course, selected: new Set(course.assignedStudents || []) })
  }

  const toggleAssign = (id)=>{
    setAssigning(prev=>{ const s = new Set(prev.selected); if(s.has(id)) s.delete(id); else s.add(id); return {...prev, selected: s} })
  }

  const saveAssign = ()=>{
    const ids = Array.from(assigning.selected)
    setCourses(prev=> prev.map(c=> c.id===assigning.course.id ? {...c, assignedStudents: ids } : c))
    setAssigning(null)
  }

  const exportCSV = ()=>{
    const headers = ['id','title','instructor','progressAvg','assignedCount']
    const rows = courses.map(c=> [c.id, c.title, c.instructor, c.progressAvg, (c.assignedStudents||[]).length])
    const csv = [headers.join(','), ...rows.map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'courses.csv'; a.click(); URL.revokeObjectURL(url)
  }

  const filtered = courses.filter(c=> c.title.toLowerCase().includes(query.toLowerCase()))

  if(loading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex gap-2">
          <input placeholder="Search courses" value={query} onChange={e=>setQuery(e.target.value)} className="rounded-md border p-2" />
          <button onClick={()=>{setEditing(null); setOpen(true)}} className="bg-primary text-white px-3 py-1 rounded">Add Course</button>
          <button onClick={exportCSV} className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded">Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(c=> <CourseCard key={c.id} course={c} onEdit={startEdit} onDelete={remove} onAssign={openAssign} />)}
      </div>

      <ModalForm open={open} title={editing ? 'Edit Course' : 'Add Course'} onClose={()=>{setOpen(false); setEditing(null)}}>
        <form onSubmit={editing ? saveEdit : add} className="space-y-3">
          <div><label className="block text-sm">Title</label><input name="title" defaultValue={editing?.title||''} required className="w-full border rounded p-2 bg-transparent"/></div>
          <div><label className="block text-sm">Instructor</label><input name="instructor" defaultValue={editing?.instructor||''} required className="w-full border rounded p-2 bg-transparent"/></div>
          <div className="flex justify-end"><button className="bg-primary text-white px-4 py-2 rounded">Save</button></div>
        </form>
      </ModalForm>

      {assigning && (
        <ModalForm open={!!assigning} title={`Assign students to ${assigning.course.title}`} onClose={()=>setAssigning(null)}>
          <div className="space-y-2 max-h-64 overflow-auto">
            {students.map(s=> (
              <label key={s.id} className="flex items-center gap-2">
                <input type="checkbox" checked={assigning.selected.has(s.id)} onChange={()=>toggleAssign(s.id)} />
                <div>{s.name} <span className="text-xs text-slate-400">{s.email}</span></div>
              </label>
            ))}
          </div>
          <div className="flex justify-end mt-3"><button onClick={saveAssign} className="bg-primary text-white px-4 py-2 rounded">Save</button></div>
        </ModalForm>
      )}
    </div>
  )
}
