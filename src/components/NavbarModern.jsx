import React, { useState } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { Bell, Search, Settings, LogOut, Moon, Sun, User, Menu, X, Home, Calendar, Users, TrendingUp } from 'lucide-react'

const NavbarModern = ({ darkMode, toggleDarkMode }) => {
  const { user, signOut } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      setShowProfileMenu(false)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Network', href: '/network', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CampusHub</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 ml-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
              <div className="mt-3 space-y-1">
                <a
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Settings
                </a>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavbarModern
