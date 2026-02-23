import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider, signInWithPopup, firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../lib/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Start with true for initial auth check
  const [needsVerification, setNeedsVerification] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      
      // Check if user exists but email is not verified
      if (user && !user.emailVerified) {
        setNeedsVerification(true)
      } else {
        setNeedsVerification(false)
      }
      
      setLoading(false) // Set loading to false after auth state is determined
    })

    return unsubscribe
  }, [])

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Send verification email
      await sendEmailVerification(result.user)
      
      // Sign out the user immediately after registration
      await firebaseSignOut(auth)
      setUser(null)
      setNeedsVerification(true)
      
      return { success: true, needsVerification: true }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'User already exists. Please sign in.' }
      } else if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak. Please use a stronger password.' }
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Invalid email address.' }
      } else {
        return { success: false, error: error.message }
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Check if email is verified
      if (!result.user.emailVerified) {
        setNeedsVerification(true)
        // Sign out the user if email is not verified
        await firebaseSignOut(auth)
        setUser(null)
        return { success: false, error: 'Email not verified. Please check your email and verify your account.' }
      }
      
      setUser(result.user)
      setNeedsVerification(false)
      return { success: true }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return { success: false, error: 'User not found. Please check your email.' }
      } else if (error.code === 'auth/wrong-password') {
        return { success: false, error: 'Email or password is incorrect.' }
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Invalid email address.' }
      } else {
        return { success: false, error: error.message }
      }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Google accounts are automatically verified, so no need to check
      setUser(result.user)
      setNeedsVerification(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setNeedsVerification(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resendVerification = async (email, password) => {
    try {
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(result.user)
      await firebaseSignOut(auth)
      setUser(null)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    needsVerification,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resendVerification,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
