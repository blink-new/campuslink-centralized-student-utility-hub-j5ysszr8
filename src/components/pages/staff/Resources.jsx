import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Resources = ({ user }) => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const data = await blink.db.resources.list({
        orderBy: { createdAt: 'desc' }
      })
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-gray-600">View and manage shared resources</p>
      </div>

      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resource Management</h3>
        <p className="text-gray-600">View all resources shared by students and staff.</p>
      </div>
    </div>
  )
}

export default Resources