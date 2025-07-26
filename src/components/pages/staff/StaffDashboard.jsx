import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from '../../layout/Navbar'
import Sidebar from '../../layout/Sidebar'
import StaffHome from './StaffHome'
import ManageAnnouncements from './ManageAnnouncements'
import ReviewComplaints from './ReviewComplaints'
import ManageTimetable from './ManageTimetable'
import ManageEvents from './ManageEvents'
import ManagePolls from './ManagePolls'
import ManageFeedback from './ManageFeedback'
import ViewSessions from './ViewSessions'
import Resources from './Resources'
import Profile from './Profile'

const StaffDashboard = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', path: '/staff', icon: '🏠' },
    { name: 'Announcements', path: '/staff/announcements', icon: '📢' },
    { name: 'Complaints', path: '/staff/complaints', icon: '📝' },
    { name: 'Timetable', path: '/staff/timetable', icon: '📅' },
    { name: 'Events', path: '/staff/events', icon: '🎉' },
    { name: 'Resources', path: '/staff/resources', icon: '📚' },
    { name: 'Polls', path: '/staff/polls', icon: '📊' },
    { name: 'Feedback', path: '/staff/feedback', icon: '💬' },
    { name: 'Sessions', path: '/staff/sessions', icon: '📈' },
    { name: 'Profile', path: '/staff/profile', icon: '👤' }
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
              <Route index element={<StaffHome user={user} />} />
              <Route path="announcements" element={<ManageAnnouncements user={user} />} />
              <Route path="complaints" element={<ReviewComplaints user={user} />} />
              <Route path="timetable" element={<ManageTimetable user={user} />} />
              <Route path="events" element={<ManageEvents user={user} />} />
              <Route path="resources" element={<Resources user={user} />} />
              <Route path="polls" element={<ManagePolls user={user} />} />
              <Route path="feedback" element={<ManageFeedback user={user} />} />
              <Route path="sessions" element={<ViewSessions user={user} />} />
              <Route path="profile" element={<Profile user={user} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default StaffDashboard