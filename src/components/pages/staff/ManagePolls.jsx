import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const ManagePolls = ({ user }) => {
  const [polls, setPolls] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const data = await blink.db.polls.list({
        orderBy: { createdAt: 'desc' }
      })
      setPolls(data)
    } catch (error) {
      console.error('Error fetching polls:', error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Polls</h1>
          <p className="text-gray-600">Create and manage student polls</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Poll
        </button>
      </div>

      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Poll Management</h3>
        <p className="text-gray-600">Create polls for student feedback and engagement.</p>
      </div>
    </div>
  )
}

export default ManagePolls