import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const data = await blink.db.announcements.list({
        orderBy: { createdAt: 'desc' }
      })
      setAnnouncements(data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🚨'
      case 'high': return '⚠️'
      case 'normal': return '📢'
      case 'low': return 'ℹ️'
      default: return '📢'
    }
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true
    return announcement.priority === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Stay updated with campus announcements</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="normal">Normal</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
                announcement.priority === 'urgent' ? 'border-l-red-500' :
                announcement.priority === 'high' ? 'border-l-orange-500' :
                announcement.priority === 'normal' ? 'border-l-blue-500' :
                'border-l-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getPriorityIcon(announcement.priority)}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none mb-4">
                    <p className="text-gray-700 leading-relaxed">{announcement.content}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🕒</span>
                      <span>{new Date(announcement.createdAt).toLocaleTimeString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>👤</span>
                      <span>Admin</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No announcements yet' : `No ${filter} priority announcements`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Check back later for campus updates and announcements.' 
                : 'Try changing the filter to see other announcements.'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Announcements
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {announcements.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcement Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {announcements.filter(a => a.priority === 'urgent').length}
              </div>
              <div className="text-sm text-gray-600">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {announcements.filter(a => a.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {announcements.filter(a => a.priority === 'normal').length}
              </div>
              <div className="text-sm text-gray-600">Normal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {announcements.filter(a => a.priority === 'low').length}
              </div>
              <div className="text-sm text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Announcements