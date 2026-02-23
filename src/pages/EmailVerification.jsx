import React, { useState } from 'react'
import { useAuth } from '../contexts/FirebaseAuthContext'
import { Mail, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const EmailVerification = ({ onBack, email }) => {
  const [resendEmail, setResendEmail] = useState('')
  const [resendPassword, setResendPassword] = useState('')
  const [showResendForm, setShowResendForm] = useState(false)
  
  const { loading, resendVerification } = useAuth()

  const handleResendVerification = async (e) => {
    e.preventDefault()
    
    const result = await resendVerification(resendEmail, resendPassword)
    if (result.success) {
      toast.success('Verification email sent again!')
      setShowResendForm(false)
      setResendEmail('')
      setResendPassword('')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We have sent you a verification email to {email || '[user email]'}. Please verify it and log in.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Login
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Didn't receive email?</span>
              </div>
            </div>

            {!showResendForm ? (
              <button
                onClick={() => setShowResendForm(true)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </button>
            ) : (
              <form onSubmit={handleResendVerification} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={resendPassword}
                    onChange={(e) => setResendPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    'Resend Email'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResendForm(false)
                    setResendEmail('')
                    setResendPassword('')
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Check your spam folder if you don't see the email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
