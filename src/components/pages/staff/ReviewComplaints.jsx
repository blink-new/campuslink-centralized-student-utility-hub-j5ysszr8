import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const ReviewComplaints = ({ user }) => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [response, setResponse] = useState('')
  const [updating, setUpdating] = useState(false)

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const data = await blink.db.complaints.list({
        orderBy: { createdAt: 'desc' }
      })
      setComplaints(data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (complaintId, newStatus, adminResponse = '') => {
    setUpdating(true)
    try {
      await blink.db.complaints.update(complaintId, {
        status: newStatus,
        adminResponse: adminResponse,
        updatedAt: new Date().toISOString()
      })

      setComplaints(complaints.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus, adminResponse: adminResponse }
          : complaint
      ))

      setSelectedComplaint(null)
      setResponse('')
    } catch (error) {
      console.error('Error updating complaint:', error)
      alert('Error updating complaint. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const openResponseModal = (complaint) => {
    setSelectedComplaint(complaint)
    setResponse(complaint.adminResponse || '')
  }

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800'
  }

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true
    return complaint.status === filter
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
          <h1 className="text-2xl font-bold text-gray-900">Review Complaints</h1>
          <p className="text-gray-600">Manage and respond to student complaints</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Complaints</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Respond to Complaint</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedComplaint.title}</h3>
              <p className="text-gray-600 mb-2">{selectedComplaint.description}</p>
              <div className="text-sm text-gray-500">
                <span>Category: {selectedComplaint.category}</span>
                <span className="ml-4">Date: {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Response
                </label>
                <textarea
                  rows={4}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your response to the student..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusUpdate(selectedComplaint.id, status.value, response)}
                      disabled={updating}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedComplaint.status === status.value
                          ? status.color
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {updating ? 'Updating...' : `Mark as ${status.label}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredComplaints.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                        {complaint.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{complaint.description}</p>
                    
                    {complaint.adminResponse && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                        <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                        <p className="text-blue-700 text-sm">{complaint.adminResponse}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <span>🕒 {new Date(complaint.createdAt).toLocaleTimeString()}</span>
                      <span>👤 Student</span>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => openResponseModal(complaint)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      {complaint.adminResponse ? 'Update' : 'Respond'}
                    </button>
                    
                    {complaint.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(complaint.id, 'in_progress')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Start Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No complaints yet' : `No ${filter.replace('_', ' ')} complaints`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Student complaints will appear here when submitted.' 
                : 'Try changing the filter to see other complaints.'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Complaints
              </button>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      {complaints.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <div key={status.value} className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {complaints.filter(c => c.status === status.value).length}
                </div>
                <div className="text-sm text-gray-600">{status.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewComplaints