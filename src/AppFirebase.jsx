import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/FirebaseAuthContext'
import LoginModern from './pages/LoginModern'
import DashboardModern from './pages/DashboardModern'
import Analytics from './pages/Analytics'
import Network from './pages/Network'
import Events from './pages/Events'

function ProtectedRoute({ children }) {
  const { user, loading, needsVerification } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user exists but needs verification, redirect to login
  if (user && needsVerification) {
    return <Navigate to="/login" replace />
  }

  // If user exists and is verified, allow access
  if (user && !needsVerification) {
    return children
  }

  // If no user, redirect to login
  return <Navigate to="/login" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginModern />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardModern darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <Events darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/network" 
          element={
            <ProtectedRoute>
              <Network darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" />} 
        />
      </Routes>
    </Router>
  )
}

function AppFirebase() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default AppFirebase
