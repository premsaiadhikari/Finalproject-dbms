import React from 'react'

export default function CourseCard({ course, onEdit, onDelete, onAssign }){
  return (
    <div className="bg-white dark:bg-slate-800 rounded-md p-4 shadow-sm hover:shadow-md transition relative">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{course.title}</div>
          <div className="text-xs text-slate-500">Instructor: {course.instructor}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>onAssign && onAssign(course)} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700">Assign</button>
          <button onClick={()=>onEdit && onEdit(course)} className="text-xs px-2 py-1 rounded bg-primary text-white">Edit</button>
          <button onClick={()=>onDelete && onDelete(course)} className="text-xs px-2 py-1 rounded bg-red-500 text-white">Delete</button>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-2" style={{width: `${course.progressAvg}%`}}></div>
        </div>
        <div className="text-xs text-slate-500 mt-1">Avg progress: {course.progressAvg}%</div>
        <div className="text-xs text-slate-400 mt-1">Assigned: {course.assignedStudents ? course.assignedStudents.length : 0}</div>
      </div>
    </div>
  )
}
