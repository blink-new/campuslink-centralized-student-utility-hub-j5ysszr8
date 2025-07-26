import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../../layout/Navbar'
import Sidebar from '../../layout/Sidebar'
import StudentHome from './StudentHome'
import Complaints from './Complaints'
import Resources from './Resources'
import Announcements from './Announcements'
import Timetable from './Timetable'
import Events from './Events'
import Polls from './Polls'
import Feedback from './Feedback'
import Profile from './Profile'

const StudentDashboard = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/student', icon: '🏠' },
    { name: 'Complaints', path: '/student/complaints', icon: '📝' },
    { name: 'Resources', path: '/student/resources', icon: '📚' },
    { name: 'Announcements', path: '/student/announcements', icon: '📢' },
    { name: 'Timetable', path: '/student/timetable', icon: '📅' },
    { name: 'Events', path: '/student/events', icon: '🎉' },
    { name: 'Polls', path: '/student/polls', icon: '📊' },
    { name: 'Feedback', path: '/student/feedback', icon: '💬' },
    { name: 'Profile', path: '/student/profile', icon: '👤' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex">
        <Sidebar 
          menuItems={menuItems}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">
            <Routes>
              <Route index element={<StudentHome user={user} />} />
              <Route path="complaints" element={<Complaints user={user} />} />
              <Route path="resources" element={<Resources user={user} />} />
              <Route path="announcements" element={<Announcements user={user} />} />
              <Route path="timetable" element={<Timetable user={user} />} />
              <Route path="events" element={<Events user={user} />} />
              <Route path="polls" element={<Polls user={user} />} />
              <Route path="feedback" element={<Feedback user={user} />} />
              <Route path="profile" element={<Profile user={user} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentDashboard