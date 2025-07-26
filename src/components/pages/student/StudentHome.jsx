import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import blink from '../../../blink/client'

const StudentHome = ({ user }) => {
  const [stats, setStats] = useState({
    complaints: 0,
    resources: 0,
    events: 0,
    polls: 0
  })
  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's complaints count
      const complaints = await blink.db.complaints.list({
        where: { userId: user.id },
        limit: 100
      })

      // Fetch recent announcements
      const announcements = await blink.db.announcements.list({
        orderBy: { createdAt: 'desc' },
        limit: 5
      })

      // Fetch resources count
      const resources = await blink.db.resources.list({
        limit: 100
      })

      // Fetch events count
      const events = await blink.db.events.list({
        limit: 100
      })

      // Fetch polls count
      const polls = await blink.db.polls.list({
        limit: 100
      })

      setStats({
        complaints: complaints.length,
        resources: resources.length,
        events: events.length,
        polls: polls.length
      })

      setRecentAnnouncements(announcements)
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
      title: 'Register Complaint',
      description: 'Submit a new complaint or issue',
      icon: '📝',
      link: '/student/complaints',
      color: 'bg-red-500'
    },
    {
      title: 'Share Resources',
      description: 'Upload and share study materials',
      icon: '📚',
      link: '/student/resources',
      color: 'bg-green-500'
    },
    {
      title: 'View Events',
      description: 'Check upcoming campus events',
      icon: '🎉',
      link: '/student/events',
      color: 'bg-purple-500'
    },
    {
      title: 'Participate in Polls',
      description: 'Vote in active polls',
      icon: '📊',
      link: '/student/polls',
      color: 'bg-blue-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="text-blue-100">Here's what's happening on your campus today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.complaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resources}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-gray-900">{stats.polls}</p>
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
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
          <Link 
            to="/student/announcements"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {recentAnnouncements.length > 0 ? (
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 {new Date(announcement.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        announcement.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        announcement.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No announcements yet</p>
        )}
      </div>
    </div>
  )
}

export default StudentHome