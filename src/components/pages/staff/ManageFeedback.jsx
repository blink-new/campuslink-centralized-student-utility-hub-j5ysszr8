import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const ManageFeedback = ({ user }) => {
  const [feedbackForms, setFeedbackForms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbackForms()
  }, [])

  const fetchFeedbackForms = async () => {
    try {
      const data = await blink.db.feedbackForms.list({
        orderBy: { createdAt: 'desc' }
      })
      setFeedbackForms(data)
    } catch (error) {
      console.error('Error fetching feedback forms:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Feedback</h1>
          <p className="text-gray-600">Create feedback forms and view responses</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Create Feedback Form
        </button>
      </div>

      <div className="text-center py-12">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Management</h3>
        <p className="text-gray-600">Create feedback forms and analyze student responses.</p>
      </div>
    </div>
  )
}

export default ManageFeedback