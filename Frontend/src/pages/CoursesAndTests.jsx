import React, { useState, useEffect } from 'react'
import { Award, BookOpen, CheckCircle, Clock, Play, RefreshCw, Star } from 'lucide-react'
import Toast from '../components/Toast'
import { api } from '../services/api'

// QUIZ DATA
const QUIZZES = {
  1: [ // Database Systems
    {
      id: 'db_q1',
      title: 'SQL Fundamentals Quiz',
      questions: [
        { q: "Which SQL clause is used to filter records?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correct: 0 },
        { q: "What does SQL stand for?", options: ["Structured Query Language", "Strong Query Language", "Simple Query List", "None of these"], correct: 0 },
        { q: "Which SQL keyword is used to sort the result-set?", options: ["SORT BY", "ORDER BY", "ARRANGE BY", "GROUP BY"], correct: 1 }
      ]
    },
    {
      id: 'db_q2',
      title: 'Relational Schema Design',
      questions: [
        { q: "What is a primary key?", options: ["A key that allows duplicates", "A unique identifier for a table record", "A key that links to another table", "None of these"], correct: 1 },
        { q: "Which normal form deals with transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correct: 2 }
      ]
    }
  ],
  2: [ // Data Structures
    {
      id: 'ds_q1',
      title: 'Trees & Graphs Quiz',
      questions: [
        { q: "What is the time complexity of searching in a perfectly balanced BST?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 1 },
        { q: "Which data structure uses LIFO order?", options: ["Queue", "Stack", "Heap", "Tree"], correct: 1 }
      ]
    },
    {
      id: 'ds_q2',
      title: 'Sorting Algorithms',
      questions: [
        { q: "Which sorting algorithm has the best worst-case performance?", options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"], correct: 2 },
        { q: "What is the average time complexity of Quick Sort?", options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"], correct: 2 }
      ]
    }
  ],
  3: [ // Web Development
    {
      id: 'wd_q1',
      title: 'React State & Lifecycle',
      questions: [
        { q: "Which hook is used to perform side effects in React?", options: ["useState", "useEffect", "useContext", "useMemo"], correct: 1 },
        { q: "What is the correct way to update state in React?", options: ["this.state.val = x", "setState(x) / setVal(x)", "val = x", "forceUpdate()"], correct: 1 }
      ]
    },
    {
      id: 'wd_q2',
      title: 'Flexbox & CSS Layouts',
      questions: [
        { q: "Which property defines the default alignment along the main axis?", options: ["align-items", "justify-content", "align-content", "flex-direction"], correct: 1 },
        { q: "Is flexbox one-dimensional or two-dimensional?", options: ["One-dimensional", "Two-dimensional", "Multi-dimensional", "None"], correct: 0 }
      ]
    }
  ]
}

const ALL_CATALOG_COURSES = [
  { id: 1, title: 'Database Systems', instructor: 'Dr. Alice Johnson', category: 'CS' },
  { id: 2, title: 'Data Structures', instructor: 'Dr. Bob Smith', category: 'CS' },
  { id: 3, title: 'Web Development', instructor: 'Dr. Carol Lee', category: 'IT' },
  { id: 4, title: 'Java Spring Boot REST APIs', instructor: 'Prof. Frank Harris', category: 'CS' },
  { id: 5, title: 'Advanced Cloud Architecture', instructor: 'Dr. Sandra Wood', category: 'IT' },
  { id: 6, title: 'Machine Learning Basics', instructor: 'Prof. Thomas Miller', category: 'CS' }
]

export default function CoursesAndTests() {
  const email = localStorage.getItem('user_email') || 'student@example.com'
  const coursesKey = `user_courses_${email}`
  const testsKey = `user_tests_${email}`

  const [enrolled, setEnrolled] = useState([])
  const [completedQuizzes, setCompletedQuizzes] = useState({})
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [activeTab, setActiveTab] = useState('my-courses') // 'my-courses' or 'catalog'
  const [teachers, setTeachers] = useState([])
  const [userInfo, setUserInfo] = useState(null)

  // INITIALIZE STATE
  useEffect(() => {
    const savedCourses = localStorage.getItem(coursesKey)
    const savedTests = localStorage.getItem(testsKey)

    if (savedCourses) {
      setEnrolled(JSON.parse(savedCourses))
    } else {
      // Default enrollment
      const defaults = [
        { id: 1, title: 'Database Systems', instructor: 'Dr. Alice Johnson', progress: 85 },
        { id: 2, title: 'Data Structures', instructor: 'Dr. Bob Smith', progress: 60 },
        { id: 3, title: 'Web Development', instructor: 'Dr. Carol Lee', progress: 35 }
      ]
      setEnrolled(defaults)
      localStorage.setItem(coursesKey, JSON.stringify(defaults))
    }

    if (savedTests) {
      setCompletedQuizzes(JSON.parse(savedTests))
    } else {
      setCompletedQuizzes({})
    }

    api.getTeachers().then(setTeachers)
    api.uinfo().then(res => setUserInfo(res?.code === 200 ? res : null))
  }, [email])

  // DYNAMICALLY MAP REAL TEACHERS & PROGRESS
  const mappedEnrolled = enrolled.map(c => {
    const teacher = teachers[c.id % Math.max(1, teachers.length)]
    return {
      ...c,
      progress: userInfo?.progress || 0,
      instructor: teacher ? (teacher.fullname || teacher.name) : c.instructor
    }
  })

  const mappedCatalog = ALL_CATALOG_COURSES.map(c => {
    const teacher = teachers[c.id % Math.max(1, teachers.length)]
    return {
      ...c,
      instructor: teacher ? (teacher.fullname || teacher.name) : c.instructor
    }
  })

  // RECALCULATE & PERSIST COURSES
  const saveCoursesToStorage = (updatedList) => {
    setEnrolled(updatedList)
    localStorage.setItem(coursesKey, JSON.stringify(updatedList))
  }

  // ENROLL IN A NEW COURSE
  const enrollCourse = (course) => {
    if (enrolled.some(c => c.id === course.id)) return
    const newCourse = { ...course, progress: 0 }
    const updated = [...enrolled, newCourse]
    saveCoursesToStorage(updated)
    setToastMsg(`Successfully enrolled in ${course.title}! 🚀`)
    setToastOpen(true)
  }

  // LAUNCH QUIZ
  const startQuiz = (quiz, courseId) => {
    setActiveQuiz({ ...quiz, courseId })
    setQuizAnswers({})
  }

  // SUBMIT QUIZ
  const submitQuiz = () => {
    if (!activeQuiz) return

    let correctCount = 0
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correctCount++
      }
    })

    const scorePercent = Math.round((correctCount / activeQuiz.questions.length) * 100)

    // Save test result
    const newCompleted = {
      ...completedQuizzes,
      [activeQuiz.id]: {
        score: scorePercent,
        completedAt: new Date().toLocaleDateString(),
        title: activeQuiz.title
      }
    }
    setCompletedQuizzes(newCompleted)
    localStorage.setItem(testsKey, JSON.stringify(newCompleted))

    // Boost course progress upon completion
    const updatedCourses = enrolled.map(c => {
      if (c.id === activeQuiz.courseId) {
        const bonus = Math.round(100 / (QUIZZES[c.id]?.length || 2))
        const newProgress = Math.min(100, c.progress + bonus)
        return { ...c, progress: newProgress }
      }
      return c
    })
    saveCoursesToStorage(updatedCourses)

    setToastMsg(`Quiz Complete! Scored ${scorePercent}% 🏆`)
    setToastOpen(true)
    setActiveQuiz(null)
  }

  // CALCULATE OVERALL PERFORMANCE
  const enrolledCount = enrolled.length
  const avgProgress = userInfo?.progress || 0
  const quizScores = Object.values(completedQuizzes).map(q => q.score)
  const completedQuizCount = quizScores.length
  const avgQuizScore = completedQuizCount ? Math.round(quizScores.reduce((sum, s) => sum + s, 0) / completedQuizCount) : 0

  return (
    <div className="space-y-6">
      {/* Header section with cumulative stats */}
      <div className="glass-card rounded-[32px] p-6 shadow-md border border-white/40 dark:border-slate-700/50 bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-indigo-500 font-semibold">Overall Performance</div>
          <h2 className="text-3xl font-bold tracking-tight mt-1 text-slate-800 dark:text-slate-100">My Learning Academy</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Track your dynamic test assessments, enroll in courses, and boost your overall score card.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setActiveTab('my-courses')} 
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${activeTab === 'my-courses' ? 'bg-primary text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            My Enrolled Courses
          </button>
          <button 
            onClick={() => setActiveTab('catalog')} 
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${activeTab === 'catalog' ? 'bg-primary text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            Course Catalog
          </button>
        </div>
      </div>

      {/* TOP ANALYTICS STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-md flex items-center gap-4 bg-white/70 dark:bg-slate-800/60">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Courses Active</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{enrolledCount}</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-md flex items-center gap-4 bg-white/70 dark:bg-slate-800/60">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg. Progress</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{avgProgress}%</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-md flex items-center gap-4 bg-white/70 dark:bg-slate-800/60">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl text-cyan-600 dark:text-cyan-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Quizzes Done</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{completedQuizCount}</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-md flex items-center gap-4 bg-white/70 dark:bg-slate-800/60">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg. Quiz Score</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{avgQuizScore}%</div>
          </div>
        </div>
      </div>

      {activeTab === 'my-courses' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ACTIVE COURSES LIST */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>My Active Courses</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{enrolledCount}</span>
            </h3>

            {enrolledCount === 0 ? (
              <div className="glass-card rounded-3xl p-8 text-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                You are not enrolled in any courses yet. Enroll in a course from the catalog to begin learning!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {mappedEnrolled.map(course => (
                  <div key={course.id} className="glass-card rounded-3xl p-5 border border-white/20 shadow-sm bg-white dark:bg-slate-800/70 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-500">{course.category || 'CS'}</span>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">{course.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Instructor: {course.instructor}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-indigo-500">{course.progress}% Complete</span>
                      </div>
                    </div>

                    <div className="mt-4 bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 transition-all duration-500" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    {/* ASSIGNED QUIZZES */}
                    <div className="mt-5 border-t border-slate-100 dark:border-slate-700/60 pt-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Associated Tests & Quizzes</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {QUIZZES[course.id] ? (
                          QUIZZES[course.id].map(quiz => {
                            const completed = completedQuizzes[quiz.id]
                            return (
                              <div key={quiz.id} className="rounded-2xl p-3 bg-slate-50/70 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{quiz.title}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5">{quiz.questions.length} Questions</div>
                                </div>
                                {completed ? (
                                  <div className="text-right">
                                    <div className="text-[10px] font-bold text-emerald-500 uppercase">Completed</div>
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{completed.score}%</div>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => startQuiz(quiz, course.id)}
                                    className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition"
                                    title="Take Quiz"
                                  >
                                    <Play size={12} fill="currentColor" />
                                  </button>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-xs text-slate-400 italic">No quizzes available for this course.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUIZ SCORECARD LIST & ACTIVITY */}
          <div className="space-y-6">
            <div className="glass-card rounded-3xl p-5 border border-white/20 shadow-sm bg-white dark:bg-slate-800/80">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                <span>Quiz Score History</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 font-semibold">{completedQuizCount}</span>
              </h3>
              {completedQuizCount === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">No quizzes completed yet.</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(completedQuizzes).map(([id, test]) => (
                    <div key={id} className="rounded-2xl p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{test.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Taken: {test.completedAt}</div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${test.score >= 80 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300' : test.score >= 50 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300' : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300'}`}>
                        {test.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* COURSE CATALOG TAB */
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>Explore Course Catalog</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{ALL_CATALOG_COURSES.length} Courses Available</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mappedCatalog.map(course => {
              const isEnrolled = enrolled.some(c => c.id === course.id)
              return (
                <div key={course.id} className="glass-card rounded-3xl p-5 border border-white/20 shadow-sm bg-white dark:bg-slate-800/80 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">{course.category}</span>
                      {isEnrolled && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Enrolled</span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-3">{course.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Instructor: {course.instructor}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">Boost your engineering and tech skills by enrolling in this comprehensive academic curriculum.</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-50 dark:border-slate-700/50 flex justify-end">
                    <button
                      disabled={isEnrolled}
                      onClick={() => enrollCourse(course)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${isEnrolled ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover shadow-sm'}`}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* INTERACTIVE QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card rounded-[32px] border border-white/20 bg-white dark:bg-slate-900 w-full max-w-lg shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">Active Test assessment</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">{activeQuiz.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveQuiz(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>

              {/* QUESTIONS LIST */}
              <div className="mt-5 space-y-5 overflow-auto pr-1" style={{ maxHeight: '50vh' }}>
                {activeQuiz.questions.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-2">
                    <div className="text-xs font-bold text-slate-500">Question {qIdx + 1} of {activeQuiz.questions.length}</div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{question.q}</div>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {question.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                          className={`w-full text-left p-3 rounded-2xl text-xs font-medium border transition ${quizAnswers[qIdx] === oIdx ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                        >
                          <span className="inline-block w-5 h-5 rounded-full mr-2 text-center bg-slate-100 dark:bg-slate-800 text-slate-500 line-height-5 inline-flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={submitQuiz}
                disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${Object.keys(quizAnswers).length < activeQuiz.questions.length ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-primary text-white shadow-md'}`}
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      <Toast 
        open={toastOpen}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </div>
  )
}
