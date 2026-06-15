import axios from 'axios'
import { students, courses, activities, weekly } from '../data/mockData'

const wait = (ms = 500) =>
  new Promise(res => setTimeout(res, ms))

// BACKEND URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9093'

// MOCK MODE
const useMock =
  import.meta.env.VITE_USE_MOCK === 'true'

// AXIOS CLIENT
const client = axios.create({

  baseURL: API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },

})

// ADD JWT TOKEN
client.interceptors.request.use((config) => {

  const token =
    localStorage.getItem('token')

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`
    config.headers.Token = token

  }

  return config
})

const normalizeRole = (rawRole) => {
  if (rawRole === undefined || rawRole === null) return '1'
  const value = String(rawRole).trim().toUpperCase()
  return (value === '2' || value === 'TEACHER' || value === 'ROLE_TEACHER' || value === 'FACULTY') ? '2' : '1'
}

const extractRole = (data) => {
  if (!data) return undefined
  if (data.role !== undefined) return data.role
  if (data.user?.role !== undefined) return data.user.role
  if (data.data?.role !== undefined) return data.data.role
  return undefined
}

// API METHODS
export const api = {

  // LOGIN
  login: async (email, pass) => {

    // MOCK LOGIN
    if (useMock) {

      await wait(600)

      const user = {
        name: 'Demo User',
        email
      }

      localStorage.setItem(
        'token',
        'mock-token'
      )

      // Set mock role based on email containing teacher/prof
      const isTeacher = email.toLowerCase().includes('teacher') || email.toLowerCase().includes('prof')
      localStorage.setItem('user_role', isTeacher ? '2' : '1')

      return {
        token: 'mock-token',
        user
      }
    }

    // REAL BACKEND LOGIN
    const response = await client.post(
      '/user/signin',
      {
        username: email,
        password: pass
      }
    )

    // LOGIN FAILED
    if (
      response.data &&
      response.data.code !== 200
    ) {

      throw new Error(
        response.data.message ||
        'Invalid credentials'
      )
    }

    // SAVE TOKEN
    if (
      response.data &&
      response.data.jwt
    ) {

      localStorage.setItem(
        'token',
        response.data.jwt
      )

      localStorage.setItem(
        'lpt_auth',
        '1'
      )

      // Try to set role from signin result first
      const initialRole = normalizeRole(extractRole(response.data))
      localStorage.setItem('user_role', initialRole)
      console.log('DEBUG: login initial role from signin response:', initialRole)

      // Pre-fetch user info to store in localStorage
      try {
        const uinfoRes = await client.get('/user/uinfo')
        console.log('DEBUG: uinfo response data:', uinfoRes.data)
        if (uinfoRes.data && uinfoRes.data.code === 200) {
          localStorage.setItem('user_fullname', uinfoRes.data.fullname || '')
          localStorage.setItem('user_email', uinfoRes.data.email || email)
          const rawRole = extractRole(uinfoRes.data)
          const normalizedRole = normalizeRole(rawRole)
          localStorage.setItem('user_role', normalizedRole)
          console.log('DEBUG: saved user_role to localStorage:', localStorage.getItem('user_role'))
        }
      } catch (err) {
        console.error('Failed to pre-fetch user info:', err)
      }
    }

    return {

      token: response.data.jwt,

      user: {
        email
      }

    }
  },

  // SIGNUP
  signup: async ({
    name,
    email,
    phone,
    department,
    password,
    role
  }) => {

    // MOCK SIGNUP
    if (useMock) {

      await wait(700)

      const exists =
        students.find(
          s => s.email === email
        )

      if (exists)
        throw new Error(
          'User already exists'
        )

      const newUser = {

        id: Date.now(),
        name,
        email,
        skills: [],
        progress: 0,

        lastUpdated:
          new Date()
            .toISOString()
            .slice(0, 10),

      }

      students.push(newUser)

      localStorage.setItem(
        'token',
        'mock-token'
      )

      localStorage.setItem(
        'lpt_auth',
        '1'
      )

      return {
        token: 'mock-token',
        user: newUser
      }
    }

    // REAL BACKEND SIGNUP
    let response;
    try {
      response = await client.post(
        '/user/signup',
        {
          fullname: name,
          email,
          phone,
          department,
          password,
          role
        }
      )
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(err.response.data.message || err.response.data.error || `Error ${err.response.status}`);
      }
      throw err;
    }

    if (
      response.data &&
      response.data.code !== 200
    ) {

      throw new Error(
        response.data.message ||
        'Signup failed'
      )
    }

    localStorage.setItem(
      'lpt_auth',
      '1'
    )

    return response.data
  },

  // CHECK EMAIL
  checkEmail: async (email) => {

    if (useMock) {

      await wait(300)

      const exists =
        students.find(
          s => s.email === email
        )

      return !!exists
    }

    try {

      const response =
        await client.get(
          `/user/check-email/${encodeURIComponent(email)}`
        )

      return !!response.data.exists

    } catch (e) {

      console.error(e)

      return false
    }
  },

  // USER INFO
  uinfo: async () => {

    try {
      const response = await client.get('/user/uinfo')
      return response.data
    } catch (e) {
      console.error('uinfo failed:', e)
      return null
    }
  },

  // DASHBOARD
  getDashboard: async () => {
    if (useMock) {
      await wait(400)
      return {
        students,
        courses,
        activities,
        weekly
      }
    }

    const [studentsRes] = await Promise.all([
      client.get('/user/students').catch(() => ({ data: [] }))
    ])

    return {
      students: studentsRes.data || [],
      courses,
      activities,
      weekly
    }
  },

  // STUDENTS
  getStudents: async () => {
    if (useMock) {
      await wait(300)
      return students
    }

    const response = await client.get('/user/students').catch(() => ({ data: [] }))
    return response.data || []
  },

  // REVIEWS
  getReviews: async () => {
    if (useMock) {
      await wait(300)
      return [
        { id: 1, username: "Alice", rating: 5, comment: "This platform is amazing!", createdAt: new Date().toISOString() },
        { id: 2, username: "Bob", rating: 4, comment: "Really helpful for my studies.", createdAt: new Date().toISOString() }
      ]
    }
    const response = await client.get('/reviews').catch(() => ({ data: [] }))
    return response.data
  },

  submitReview: async (reviewData) => {
    if (useMock) {
      await wait(500)
      return { success: true, data: { id: Date.now(), ...reviewData, createdAt: new Date().toISOString() } }
    }
    const response = await client.post('/reviews', reviewData).catch(err => {
      console.error("Failed to submit review", err)
      throw new Error("Failed to submit review")
    })
    return response.data
  },

  // COURSES
  getCourses: async () => {

    await wait(300)

    return courses
  },

  // DELETE STUDENT
  deleteStudent: async (studentId) => {
    if (useMock) {
      await wait(300)
      const index = students.findIndex(s => s.id === studentId)
      if (index !== -1) students.splice(index, 1)
      return { success: true }
    }

    // Attempting a common REST endpoint for deleting users/students
    const response = await client.delete(`/user/delete/${studentId}`).catch(err => {
      // Fallback if the endpoint is different, logging for debugging
      console.error("Backend delete failed. Please ensure the endpoint exists.", err)
      throw new Error("Backend delete failed")
    })
    return response.data
  },

  // ASSIGN COURSE
  assignCourse: async (studentId, courseId) => {
    if (useMock) {
      await wait(300)
      const course = courses.find(c => c.id === parseInt(courseId))
      if (course && !course.assignedStudents.includes(studentId)) {
        course.assignedStudents.push(studentId)
      }
      return { success: true }
    }

    // Attempting a common REST endpoint for assigning courses
    let response;
    try {
      response = await client.post(`/user/assign-course`, { studentId, courseId });
    } catch (err) {
      if (err.response) {
        throw new Error(`Backend assign failed: Server returned ${err.response.status}`);
      }
      throw new Error("Backend assign failed: Network Error");
    }
    if (response.data && response.data.code && response.data.code !== 200) {
      throw new Error(response.data.message || "Failed to assign course")
    }
    return response.data
  },

  // UPDATE PROGRESS
  updateProgress: async (studentId, progress) => {
    if (useMock) {
      await wait(500)
      return { success: true }
    }
    const response = await client.post(`/user/update-progress`, { studentId, progress }).catch(err => {
      if (err.response) {
        throw new Error(`Server returned ${err.response.status}`)
      }
      throw new Error("Network Error")
    })
    if (response.data && response.data.code && response.data.code !== 200) {
      throw new Error(response.data.message || "Failed to update progress")
    }
    return response.data
  },

  // GET TEACHERS
  getTeachers: async () => {
    if (useMock) {
      await wait(300)
      return [
        { id: 101, fullname: "Dr. A" },
        { id: 102, fullname: "Dr. B" },
      ]
    }
    const response = await client.get('/user/teachers').catch(() => ({ data: [] }))
    return response.data || []
  },

}