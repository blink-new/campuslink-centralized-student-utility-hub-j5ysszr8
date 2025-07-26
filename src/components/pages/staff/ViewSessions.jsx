import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const ViewSessions = ({ user }) => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await blink.db.userSessions.list({
        orderBy: { loginTime: 'desc' },
        limit: 50
      })
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Sessions</h1>
        <p className="text-gray-600">Monitor user activity and login sessions</p>
      </div>

      <div className="text-center py-12">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Session Analytics</h3>
        <p className="text-gray-600">Track user login sessions and activity patterns.</p>
      </div>
    </div>
  )
}

export default ViewSessions