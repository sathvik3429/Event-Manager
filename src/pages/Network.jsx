import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import NavbarModern from '../components/NavbarModern'
import { Users, Search, Filter, MessageCircle, UserPlus, Calendar, MapPin, Star, Heart, Share2 } from 'lucide-react'

const Network = ({ darkMode, toggleDarkMode }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('discover')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock network data
  const suggestedConnections = [
    {
      id: 1,
      name: 'Emily Chen',
      role: 'Computer Science Student',
      bio: 'Passionate about AI and machine learning',
      interests: ['Technology', 'AI', 'Programming'],
      eventsAttended: 12,
      mutualConnections: 5,
      avatar: 'https://picsum.photos/seed/emily/100/100.jpg'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Business Administration',
      bio: 'Event organizer and marketing enthusiast',
      interests: ['Business', 'Marketing', 'Leadership'],
      eventsAttended: 18,
      mutualConnections: 3,
      avatar: 'https://picsum.photos/seed/michael/100/100.jpg'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Design Student',
      bio: 'Creative designer with love for UX/UI',
      interests: ['Design', 'Art', 'Technology'],
      eventsAttended: 8,
      mutualConnections: 7,
      avatar: 'https://picsum.photos/seed/sarah/100/100.jpg'
    }
  ]

  const myConnections = [
    {
      id: 4,
      name: 'David Kim',
      role: 'Engineering Student',
      bio: 'Robotics and automation enthusiast',
      interests: ['Engineering', 'Robotics', 'Innovation'],
      eventsAttended: 15,
      lastActive: '2 hours ago',
      avatar: 'https://picsum.photos/seed/david/100/100.jpg'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Marketing Student',
      bio: 'Digital marketing and social media expert',
      interests: ['Marketing', 'Social Media', 'Content'],
      eventsAttended: 10,
      lastActive: '1 day ago',
      avatar: 'https://picsum.photos/seed/lisa/100/100.jpg'
    }
  ]

  const networkEvents = [
    {
      id: 1,
      title: 'Networking Mixer',
      date: '2024-03-10',
      time: '6:00 PM',
      location: 'Student Union',
      attendees: 45,
      maxAttendees: 100,
      category: 'Social',
      image: 'https://picsum.photos/seed/networking/400/300.jpg'
    },
    {
      id: 2,
      title: 'Tech Meetup',
      date: '2024-03-12',
      time: '5:30 PM',
      location: 'Tech Hub',
      attendees: 28,
      maxAttendees: 50,
      category: 'Technology',
      image: 'https://picsum.photos/seed/tech-meetup/400/300.jpg'
    }
  ]

  const filters = ['all', 'students', 'organizers', 'alumni']

  const filteredConnections = suggestedConnections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'students' && connection.role.includes('Student')) ||
                         (selectedFilter === 'organizers' && connection.bio.includes('organizer'))
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarModern darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network</h1>
          <p className="text-gray-600">Connect with students and expand your campus network</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {['discover', 'connections', 'events'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'discover' ? 'Discover People' : 
                 tab === 'connections' ? 'My Connections' : 'Network Events'}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {filters.map(filter => (
                <option key={filter} value={filter}>
                  {filter === 'all' ? 'All People' : 
                   filter === 'students' ? 'Students' :
                   filter === 'organizers' ? 'Organizers' : 'Alumni'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'discover' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((person) => (
              <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{person.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {person.eventsAttended} events
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {person.mutualConnections} mutual
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Connect
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myConnections.map((person) => (
              <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.role}</p>
                    <p className="text-xs text-green-600">Active {person.lastActive}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{person.bio}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {person.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {person.eventsAttended} events
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkEvents.map((event) => (
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
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Register for Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Network
