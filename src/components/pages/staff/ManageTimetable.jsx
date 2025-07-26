import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const ManageTimetable = ({ user }) => {
  const [timetables, setTimetables] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    department: '',
    year: '',
    file: null
  })

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology'
  ]

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']

  useEffect(() => {
    fetchTimetables()
  }, [])

  const fetchTimetables = async () => {
    try {
      const data = await blink.db.timetables.list({
        orderBy: { updatedAt: 'desc' }
      })
      setTimetables(data)
    } catch (error) {
      console.error('Error fetching timetables:', error)
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
    if (!formData.file) {
      alert('Please select a file to upload.')
      return
    }

    setUploading(true)

    try {
      // Upload file
      const uploadResult = await blink.storage.upload(
        formData.file,
        `timetables/${formData.department}_${formData.year}_${Date.now()}.pdf`,
        { upsert: true }
      )

      // Check if timetable already exists for this department and year
      const existingTimetable = timetables.find(
        t => t.department === formData.department && t.year === formData.year
      )

      if (existingTimetable) {
        // Update existing timetable
        await blink.db.timetables.update(existingTimetable.id, {
          fileUrl: uploadResult.publicUrl,
          updatedAt: new Date().toISOString()
        })

        setTimetables(timetables.map(t => 
          t.id === existingTimetable.id 
            ? { ...t, fileUrl: uploadResult.publicUrl, updatedAt: new Date().toISOString() }
            : t
        ))
      } else {
        // Create new timetable
        const newTimetable = await blink.db.timetables.create({
          id: `timetable_${Date.now()}`,
          userId: user.id,
          department: formData.department,
          year: formData.year,
          fileUrl: uploadResult.publicUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

        setTimetables([newTimetable, ...timetables])
      }

      setFormData({ department: '', year: '', file: null })
      setShowForm(false)
      alert('Timetable uploaded successfully!')
    } catch (error) {
      console.error('Error uploading timetable:', error)
      alert('Error uploading timetable. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this timetable?')) return

    try {
      await blink.db.timetables.delete(id)
      setTimetables(timetables.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting timetable:', error)
      alert('Error deleting timetable. Please try again.')
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Timetables</h1>
          <p className="text-gray-600">Upload and manage class timetables</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Upload Timetable
        </button>
      </div>

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Timetable</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timetable File
                </label>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload Timetable'}
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

      {/* Timetables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timetables.length > 0 ? (
          timetables.map((timetable) => (
            <div key={timetable.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {timetable.department}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {timetable.year}
                    </span>
                  </div>
                </div>
                <div className="text-3xl">📅</div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div>Last Updated: {new Date(timetable.updatedAt).toLocaleDateString()}</div>
                <div>Created: {new Date(timetable.createdAt).toLocaleDateString()}</div>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={timetable.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(timetable.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timetables uploaded</h3>
            <p className="text-gray-600 mb-4">Upload timetables for different departments and years.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Upload First Timetable
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTimetable