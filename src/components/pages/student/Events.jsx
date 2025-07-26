import React, { useState, useEffect } from 'react'
import blink from '../../../blink/client'

const Events = ({ user }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, past

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await blink.db.events.list({
        orderBy: { eventDate: 'desc' }
      })
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const isUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date()
  }

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return isUpcoming(event.eventDate)
    if (filter === 'past') return !isUpcoming(event.eventDate)
    return true
  })

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      day: date.toLocaleDateString('en-US', { weekday: 'long' })
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
          <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-600">Discover and participate in campus activities</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const eventDateTime = formatEventDate(event.eventDate)
            const upcoming = isUpcoming(event.eventDate)
            
            return (
              <div 
                key={event.id} 
                className={`bg-white rounded-lg shadow-sm border p-6 ${
                  upcoming ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🎉</span>
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        upcoming 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {upcoming ? 'UPCOMING' : 'COMPLETED'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📅</span>
                        <div>
                          <div className="font-medium">{eventDateTime.date}</div>
                          <div className="text-xs">{eventDateTime.day}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🕒</span>
                        <div>
                          <div className="font-medium">{eventDateTime.time}</div>
                          <div className="text-xs">Local Time</div>
                        </div>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>📍</span>
                          <div>
                            <div className="font-medium">{event.location}</div>
                            <div className="text-xs">Venue</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Posted on {new Date(event.createdAt).toLocaleDateString()}
                      </div>
                      
                      {upcoming && (
                        <div className="flex items-center space-x-2">
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Mark Interested
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'upcoming' ? 'No upcoming events' : 
               filter === 'past' ? 'No past events' : 'No events yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'upcoming' ? 'Check back later for new events and activities.' :
               filter === 'past' ? 'Past events will appear here once they are completed.' :
               'Events will appear here once posted by admin.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                View All Events
              </button>
            )}
          </div>
        )}
      </div>

      {/* Event Statistics */}
      {events.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {events.filter(e => isUpcoming(e.eventDate)).length}
              </div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-1">
                {events.filter(e => !isUpcoming(e.eventDate)).length}
              </div>
              <div className="text-sm text-gray-600">Past Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {events.length}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Event Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span>💡</span>
            <div>
              <div className="font-medium text-gray-900">Stay Updated</div>
              <div className="text-gray-600">Check announcements for event updates and changes.</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🔔</span>
            <div>
              <div className="font-medium text-gray-900">Don't Miss Out</div>
              <div className="text-gray-600">Mark events as interested to get reminders.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events