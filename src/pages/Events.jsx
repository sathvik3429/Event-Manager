import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { getAllEvents, createEvent, registerForEvent, unregisterFromEvent, isUserRegistered } from '../services/firebaseService'
import NavbarModern from '../components/NavbarModern'
import { Calendar, Users, MapPin, Search, Filter, Plus, Clock, Star, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const Events = ({ darkMode, toggleDarkMode }) => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userRegistrations, setUserRegistrations] = useState(new Set())

  const categories = ['all', 'Technology', 'Entertainment', 'Career', 'Sports', 'Academic', 'Social']
  const eventsPerPage = 6

  // Form data for create event modal
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    maxAttendees: 50
  })

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await getAllEvents()
        if (result.success) {
          setEvents(result.data)
          
          // Check user registrations
          if (user) {
            const registrationSet = new Set()
            for (const event of result.data) {
              const regResult = await isUserRegistered(user.uid, event.id)
              if (regResult.isRegistered) {
                registrationSet.add(event.id)
              }
            }
            setUserRegistrations(registrationSet)
          }
        }
      } catch (error) {
        toast.error('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [user])

  const handleRegister = async (eventId) => {
    if (!user) {
      toast.error('Please sign in to register for events')
      return
    }

    if (userRegistrations.has(eventId)) {
      // Unregister
      const result = await unregisterFromEvent(user.uid, eventId)
      if (result.success) {
        setUserRegistrations(prev => {
          const newSet = new Set(prev)
          newSet.delete(eventId)
          return newSet
        })
        toast.success('Unregistered from event')
      } else {
        toast.error(result.error)
      }
    } else {
      // Register
      const result = await registerForEvent(user.uid, eventId)
      if (result.success) {
        setUserRegistrations(prev => new Set([...prev, eventId]))
        toast.success('Registered for event!')
      } else {
        toast.error(result.error)
      }
    }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in to create events')
      return
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      maxAttendees: parseInt(formData.maxAttendees),
      organizerId: user.uid,
      organizerName: user.displayName || user.email.split('@')[0],
      organizerEmail: user.email,
      image: `https://picsum.photos/seed/${formData.title.replace(/\s+/g, '-')}/400/300.jpg`
    }

    const result = await createEvent(eventData)
    if (result.success) {
      toast.success('Event created successfully!')
      setShowCreateModal(false)
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Technology',
        maxAttendees: 50
      })
    } else {
      toast.error(result.error)
    }
  }

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesDate = !selectedDate || event.date === selectedDate
    return matchesSearch && matchesCategory && matchesDate
  })

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarModern darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Events</h1>
          <p className="text-gray-600">Discover and join exciting events happening on campus</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                List
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Showing {paginatedEvents.length} of {filteredEvents.length} events
            </p>
          </div>
        </div>

        {/* Events Display */}
        {paginatedEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or create a new event</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          Limited spots available
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">by {event.organizerName}</span>
                        <button
                          onClick={() => handleRegister(event.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            userRegistrations.has(event.id)
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {userRegistrations.has(event.id) ? 'Registered' : 'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {paginatedEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img src={event.image} alt={event.title} className="w-full md:w-48 h-32 md:h-32 object-cover rounded-lg" />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {event.category}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            by {event.organizerName}
                          </div>
                        </div>

                        <button
                          onClick={() => handleRegister(event.id)}
                          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                            userRegistrations.has(event.id)
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {userRegistrations.has(event.id) ? 'Registered' : 'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter event title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your event"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Event location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      >
                        {categories.filter(cat => cat !== 'all').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                      <input
                        type="number"
                        value={formData.maxAttendees}
                        onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                        placeholder="Maximum number of attendees"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
