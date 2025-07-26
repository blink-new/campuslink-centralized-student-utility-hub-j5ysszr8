import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Resources = ({ user }) => {
  const [resources, setResources] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'notes',
    file: null
  })

  const categories = [
    { value: 'notes', label: 'Study Notes' },
    { value: 'assignments', label: 'Assignments' },
    { value: 'projects', label: 'Projects' },
    { value: 'books', label: 'Books/PDFs' },
    { value: 'videos', label: 'Video Lectures' },
    { value: 'other', label: 'Other' }
  ]

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, file })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let fileUrl = null

      // Upload file if provided
      if (formData.file) {
        setUploading(true)
        const uploadResult = await blink.storage.upload(
          formData.file,
          `resources/${Date.now()}_${formData.file.name}`,
          { upsert: true }
        )
        fileUrl = uploadResult.publicUrl
        setUploading(false)
      }

      const newResource = await blink.db.resources.create({
        id: `resource_${Date.now()}`,
        userId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        fileUrl: fileUrl,
        createdAt: new Date().toISOString()
      })

      setResources([newResource, ...resources])
      setFormData({ title: '', description: '', category: 'notes', file: null })
      setShowForm(false)
    } catch (error) {
      console.error('Error sharing resource:', error)
      alert('Error sharing resource. Please try again.')
    } finally {
      setSubmitting(false)
      setUploading(false)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">Share and access study materials</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Share Resource
        </button>
      </div>

      {/* Share Resource Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Share New Resource</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Brief description of the resource"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.mp4,.avi"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF, DOC, PPT, Images, Videos (Max 10MB)
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {uploading ? 'Uploading...' : submitting ? 'Sharing...' : 'Share Resource'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{resource.title}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                    {resource.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-2xl">📚</div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              
              {resource.fileUrl && (
                <div className="mb-4">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>📎</span>
                    <span>Download File</span>
                  </a>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                <span>👤 Shared by student</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share a resource with your classmates!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Share Your First Resource
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources