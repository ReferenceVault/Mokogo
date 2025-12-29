import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Auth = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 5) return cleaned
    if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
    }
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`
  }

  const validatePhone = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, '')
    return cleaned.length === 10
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // TODO: Implement actual sign in logic
    // For now, navigate to dashboard
    navigate('/dashboard')
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // TODO: Implement actual sign up logic
    // For now, navigate to dashboard
    navigate('/dashboard')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(value)
    setError('')
  }

  const displayPhone = formatPhoneNumber(phone)

  return (
    <div className="bg-mokogo-off-white min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Two Column Layout */}
      <main className="flex-1 flex items-start py-12 px-16" style={{ fontSize: '90%' }}>
        <div className="max-w-7xl mx-auto w-full px-24">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            
            {/* Left Section - Informational Panel */}
            <div className="space-y-8">
              {/* Secure Authentication Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mokogo-info-bg border border-mokogo-info-border rounded-full">
                <svg className="w-4 h-4 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-mokogo-primary">Secure Authentication</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Welcome to MOKOGO
                </h1>
                <p className="text-lg text-gray-600">
                  Create your account in seconds and start listing your property to thousands of verified flatmate seekers.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quick Setup</h3>
                    <p className="text-gray-600 text-sm">Get verified in under 2 minutes with phone OTP authentication</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bank-Level Security</h3>
                    <p className="text-gray-600 text-sm">Your phone number is encrypted and never shared publicly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Trusted Community</h3>
                    <p className="text-gray-600 text-sm">Join 50,000+ verified users on India's safest flatmate platform</p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div className="bg-white border border-mokogo-gray rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-lg">PS</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                      "Found my perfect flatmate in 5 days! The verification process made me feel completely safe."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Sign In / Sign Up Forms */}
            <div>
              <div className="w-full">
                <div className="bg-white rounded-xl shadow-lg border border-mokogo-gray p-8">
                  {/* Tab Switcher */}
                  <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => {
                        setAuthMode('signin')
                        setError('')
                      }}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        authMode === 'signin'
                          ? 'bg-white text-orange-400 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('signup')
                        setError('')
                      }}
                      className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                        authMode === 'signup'
                          ? 'bg-white text-orange-400 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                {authMode === 'signin' ? (
                  <>
                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Sign In
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSignInSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && !password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter your email"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter your password"
                          disabled={isLoading}
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}

                      {/* Remember me and Forgot password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-mokogo-primary border-gray-300 rounded focus:ring-mokogo-primary"
                          />
                          <span className="text-sm text-gray-700">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-mokogo-primary hover:underline">
                          Forgot your password?
                        </a>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!email || !password || isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <span>Sign In</span>
                        )}
                      </button>
                    </form>

                    {/* Or continue with */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                    </div>

                    {/* Sign in with Google */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center py-4 px-6 border-2 border-orange-400 rounded-lg bg-white text-orange-400 font-medium text-base hover:bg-orange-50 transition-colors"
                      >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    </div>

                    {/* Security Badges */}
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-gray-600">Secure</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600">Private</span>
                      </div>
                    </div>

                    {/* SSL Encryption Note */}
                    <div className="mt-6 pt-6 border-t border-mokogo-gray flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs text-gray-600">Your information is protected with 256-bit SSL encryption</span>
                    </div>

                  </>
                ) : (
                  <>
                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                      Create Account
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSignUpSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <input
                          id="signup-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && !email && !phone && !password && !confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter your name"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>

                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email address
                        </label>
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <select
                                className="input-field w-24 appearance-none pr-8 bg-gray-50 cursor-pointer"
                                defaultValue="+91"
                              >
                                <option value="+91">IN +91</option>
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <input
                              id="signup-phone"
                              type="tel"
                              value={displayPhone}
                              onChange={handlePhoneChange}
                              className={`input-field ${error && phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              placeholder="Enter your phone number"
                              maxLength={12}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && password && !confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Enter your password"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          id="signup-confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setError('')
                          }}
                          className={`input-field ${error && confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="Confirm your password"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Terms and Privacy Policy Checkbox */}
                      <div className="flex items-start gap-2">
                        <input
                          id="agree-terms"
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => {
                            setAgreeToTerms(e.target.checked)
                            setError('')
                          }}
                          className="w-4 h-4 mt-0.5 text-mokogo-primary border-gray-300 rounded focus:ring-mokogo-primary"
                        />
                        <label htmlFor="agree-terms" className="text-sm text-gray-700 cursor-pointer">
                          I agree to the <span className="font-semibold">Terms of Service</span> and <span className="font-semibold">Privacy Policy</span>
                        </label>
                      </div>
                      
                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!name || !email || phone.length !== 10 || !password || !confirmPassword || !agreeToTerms || isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Creating account...</span>
                          </>
                        ) : (
                          <span>Create Account</span>
                        )}
                      </button>
                    </form>

                    {/* Or continue with */}
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                    </div>

                    {/* Sign up with Google */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center py-4 px-6 border-2 border-orange-400 rounded-lg bg-white text-orange-400 font-medium text-base hover:bg-orange-50 transition-colors"
                      >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign up with Google</span>
                      </button>
                    </div>


                    {/* Security Badges */}
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-gray-600">Secure</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600">Private</span>
                      </div>
                    </div>

                    {/* SSL Encryption Note */}
                    <div className="mt-6 pt-6 border-t border-mokogo-gray flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs text-gray-600">Your information is protected with 256-bit SSL encryption</span>
                    </div>
                  </>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600 text-sm md:text-base">Verified Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">15K+</div>
              <div className="text-gray-600 text-sm md:text-base">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-1">
                4.8
                <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <div className="text-gray-600 text-sm md:text-base">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">₹2Cr+</div>
              <div className="text-gray-600 text-sm md:text-base">Brokerage Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Verify Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why verify with MOKOGO?
            </h2>
            <p className="text-lg text-gray-600">
              Your safety and privacy come first
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Verified Community */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Community</h3>
              <p className="text-gray-600 text-sm">
                All users are verified with phone OTP and government ID for maximum safety
              </p>
            </div>

            {/* Card 2: Number Privacy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center mb-4 relative">
                <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg className="w-5 h-5 text-mokogo-primary absolute top-1 right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(45deg)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Number Privacy</h3>
              <p className="text-gray-600 text-sm">
                Your phone number stays private and is never shared with other users
              </p>
            </div>

            {/* Card 3: Data Protection */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Protection</h3>
              <p className="text-gray-600 text-sm">
                Bank-level encryption ensures your personal information stays secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What our users say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by thousands of property owners
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The verification process was so quick and easy! I felt safe knowing everyone on the platform is verified. Found my flatmate in just 3 days."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">RV</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rahul Verma</div>
                  <div className="text-sm text-gray-600">Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Love that my phone number stays private! The OTP verification gave me confidence that I'm dealing with real, verified people."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">AD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Anjali Desai</div>
                  <div className="text-sm text-gray-600">Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Common questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything about phone verification
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Why do I need to verify my phone number?
              </h3>
              <p className="text-gray-600 text-sm">
                Phone verification ensures all users are real people, creating a safe and trusted community. It also helps us prevent spam and protect your account.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Will my phone number be shared publicly?
              </h3>
              <p className="text-gray-600 text-sm">
                Never! Your phone number is kept completely private and encrypted. Other users cannot see it. All communication happens through secure in-app messaging.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if I don't receive the OTP?
              </h3>
              <p className="text-gray-600 text-sm">
                You can request a new OTP after 90 seconds. If you still don't receive it, check your phone's SMS settings or try again after a few minutes. Contact support if the issue persists.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! We use bank-level 256-bit SSL encryption to protect your information. Your data is stored on secure servers and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Auth

