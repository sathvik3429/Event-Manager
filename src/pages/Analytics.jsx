import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import NavbarModern from '../components/NavbarModern'
import { TrendingUp, Users, Calendar, Eye, BarChart3, PieChart, Activity, ArrowUp, ArrowDown } from 'lucide-react'

const Analytics = ({ darkMode, toggleDarkMode }) => {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)

  // Mock analytics data
  const stats = [
    {
      title: 'Total Views',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      title: 'Event Registrations',
      value: '456',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Active Events',
      value: '24',
      change: '-5.2%',
      trend: 'down',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Engagement Rate',
      value: '68.4%',
      change: '+8.7%',
      trend: 'up',
      icon: Activity,
      color: 'bg-orange-500'
    }
  ]

  const categoryData = [
    { category: 'Technology', events: 8, registrations: 234 },
    { category: 'Entertainment', events: 6, registrations: 189 },
    { category: 'Career', events: 5, registrations: 156 },
    { category: 'Sports', events: 3, registrations: 98 },
    { category: 'Academic', events: 2, registrations: 67 }
  ]

  const recentActivity = [
    { id: 1, action: 'New registration', event: 'Tech Talk: AI in Education', time: '2 minutes ago', user: 'John Doe' },
    { id: 2, action: 'Event created', event: 'Spring Music Festival', time: '15 minutes ago', user: 'Jane Smith' },
    { id: 3, action: 'Registration cancelled', event: 'Career Fair 2024', time: '1 hour ago', user: 'Mike Johnson' },
    { id: 4, action: 'Event updated', event: 'Sports Tournament', time: '2 hours ago', user: 'Sarah Wilson' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarModern darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your event performance and user engagement</p>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range === '24h' ? 'Last 24 Hours' : 
                   range === '7d' ? 'Last 7 Days' :
                   range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Category Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm text-gray-600">{category.events} events</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(category.registrations / 234) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">{category.registrations}</p>
                    <p className="text-xs text-gray-600">registrations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="border-l-2 border-indigo-200 pl-4">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600 mb-1">{activity.event}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{activity.user}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registration Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Registration Trends</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart visualization coming soon</p>
                <p className="text-sm text-gray-500">Integration with chart library needed</p>
              </div>
            </div>
          </div>

          {/* Event Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Distribution</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Pie chart coming soon</p>
                <p className="text-sm text-gray-500">Integration with chart library needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
