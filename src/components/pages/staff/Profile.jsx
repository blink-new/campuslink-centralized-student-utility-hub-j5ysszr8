import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    department: '',
    role: 'staff'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
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
          role: userProfile.role || 'staff'
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
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
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your profile information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.name || 'Staff User'}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-blue-600 font-medium capitalize">{profile.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <p className="text-gray-900 py-2">{profile.name || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-gray-900 py-2">{profile.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <p className="text-gray-900 py-2">{profile.department || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900 py-2 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile