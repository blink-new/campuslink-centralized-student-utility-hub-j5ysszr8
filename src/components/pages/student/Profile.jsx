import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    phone: '',
    address: ''
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    complaints: 0,
    resources: 0,
    pollsVoted: 0,
    feedbackSubmitted: 0
  })

  useEffect(() => {
    fetchProfile()
    fetchUserStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const userData = await blink.db.users.list({
        where: { id: user.id },
        limit: 1
      })
      
      if (userData.length > 0) {
        const userProfile = userData[0]
        setProfile({
          name: userProfile.name || '',
          email: userProfile.email || '',
          department: userProfile.department || '',
          year: userProfile.year || '',
          phone: userProfile.phone || '',
          address: userProfile.address || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      // Fetch user's complaints
      const complaints = await blink.db.complaints.list({
        where: { userId: user.id }
      })

      // Fetch user's resources
      const resources = await blink.db.resources.list({
        where: { userId: user.id }
      })

      // Fetch user's poll votes
      const pollVotes = await blink.db.pollVotes.list({
        where: { userId: user.id }
      })

      // Fetch user's feedback responses
      const feedbackResponses = await blink.db.feedbackResponses.list({
        where: { userId: user.id }
      })

      setStats({
        complaints: complaints.length,
        resources: resources.length,
        pollsVoted: pollVotes.length,
        feedbackSubmitted: feedbackResponses.length
      })
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await blink.db.users.update(user.id, {
        name: profile.name,
        department: profile.department,
        year: profile.year,
        phone: profile.phone,
        address: profile.address,
        updatedAt: new Date().toISOString()
      })
      
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    fetchProfile() // Reset to original values
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
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and view activity</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.name || 'Student User'}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-blue-600 font-medium">Student</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-gray-900 py-2">{profile.email}</p>
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            {editing ? (
              <select
                value={profile.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            ) : (
              <p className="text-gray-900 py-2">{profile.department || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year of Study
            </label>
            {editing ? (
              <select
                value={profile.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            ) : (
              <p className="text-gray-900 py-2">{profile.year || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {editing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            {editing ? (
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your address"
              />
            ) : (
              <p className="text-gray-900 py-2">{profile.address || 'Not provided'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Activity Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-red-600 text-xl">📝</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.complaints}</div>
            <div className="text-sm text-gray-600">Complaints</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 text-xl">📚</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.resources}</div>
            <div className="text-sm text-gray-600">Resources Shared</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pollsVoted}</div>
            <div className="text-sm text-gray-600">Polls Voted</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 text-xl">💬</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.feedbackSubmitted}</div>
            <div className="text-sm text-gray-600">Feedback Given</div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Account Type:</span>
            <span className="font-medium text-gray-900">Student</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member Since:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Login:</span>
            <span className="font-medium text-gray-900">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile