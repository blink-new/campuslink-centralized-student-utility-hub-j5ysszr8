import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import blink from '../../../blink/client'

const StaffHome = ({ user }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalFeedbackForms: 0,
    totalStudents: 0,
    totalResources: 0
  })
  const [recentComplaints, setRecentComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch complaints
      const complaints = await blink.db.complaints.list({
        orderBy: { createdAt: 'desc' },
        limit: 100
      })

      // Fetch announcements
      const announcements = await blink.db.announcements.list({
        limit: 100
      })

      // Fetch events
      const events = await blink.db.events.list({
        limit: 100
      })

      // Fetch polls
      const polls = await blink.db.polls.list({
        limit: 100
      })

      // Fetch feedback forms
      const feedbackForms = await blink.db.feedbackForms.list({
        limit: 100
      })

      // Fetch users (students)
      const users = await blink.db.users.list({
        where: { role: 'student' },
        limit: 100
      })

      // Fetch resources
      const resources = await blink.db.resources.list({
        limit: 100
      })

      setStats({
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
        totalAnnouncements: announcements.length,
        totalEvents: events.length,
        totalPolls: polls.length,
        totalFeedbackForms: feedbackForms.length,
        totalStudents: users.length,
        totalResources: resources.length
      })

      setRecentComplaints(complaints.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Post Announcement',
      description: 'Create new campus announcements',
      icon: '📢',
      link: '/staff/announcements',
      color: 'bg-blue-500'
    },
    {
      title: 'Review Complaints',
      description: 'Handle student complaints',
      icon: '📝',
      link: '/staff/complaints',
      color: 'bg-red-500',
      badge: stats.pendingComplaints > 0 ? stats.pendingComplaints : null
    },
    {
      title: 'Manage Events',
      description: 'Create and manage events',
      icon: '🎉',
      link: '/staff/events',
      color: 'bg-purple-500'
    },
    {
      title: 'Create Poll',
      description: 'Create polls for students',
      icon: '📊',
      link: '/staff/polls',
      color: 'bg-green-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-blue-100">Manage your campus efficiently with these tools.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
              {stats.pendingComplaints > 0 && (
                <p className="text-xs text-red-600">{stats.pendingComplaints} pending</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📢</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Announcements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAnnouncements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPolls}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback Forms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFeedbackForms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Timetables</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="relative p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors group"
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
          <Link 
            to="/staff/complaints"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {recentComplaints.length > 0 ? (
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <span className="capitalize">📂 {complaint.category}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No complaints yet</p>
        )}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Database: Online</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Authentication: Active</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">File Storage: Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffHome