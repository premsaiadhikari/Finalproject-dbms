export const students = [
  { id:1, name:'Alice Johnson', email:'alice@example.com', department:'CS', skills:['SQL','React'], progress:78, lastUpdated:'2026-05-12' },
  { id:2, name:'Bob Smith', email:'bob@example.com', department:'IT', skills:['Java','DBMS'], progress:56, lastUpdated:'2026-05-11' },
  { id:3, name:'Carol Lee', email:'carol@example.com', department:'CS', skills:['Python','Analytics'], progress:92, lastUpdated:'2026-05-10' }
]

export const courses = [
  { id:1, title:'Database Systems', instructor:'Dr. A', progressAvg:78, assignedStudents: [] },
  { id:2, title:'Data Structures', instructor:'Dr. B', progressAvg:62, assignedStudents: [] },
  { id:3, title:'Web Development', instructor:'Dr. C', progressAvg:84, assignedStudents: [] },
  { id:4, title:'Software Engineering', instructor:'Dr. D', progressAvg:88, assignedStudents: [] },
  { id:5, title:'Computer Networks', instructor:'Dr. E', progressAvg:70, assignedStudents: [] },
  { id:6, title:'Operating Systems', instructor:'Dr. F', progressAvg:65, assignedStudents: [] }
]

export const activities = [
  { id:1, text:'Alice completed assignment 3', time:'2h ago' },
  { id:2, text:'Bob submitted quiz 2', time:'1d ago' },
  { id:3, text:'Carol reached 90% in Database Systems', time:'3d ago' }
]

export const weekly = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  data: [12, 19, 7, 15, 10, 5, 9]
}
