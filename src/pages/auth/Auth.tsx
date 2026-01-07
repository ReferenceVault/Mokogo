import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TermsModal from '@/components/TermsModal'

import { authApi } from '@/services/api'
import { useStore } from '@/store/useStore'
import SocialSidebar from '@/components/SocialSidebar'
import { Shield, Zap, Users, CheckCircle, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'

const Auth = () => {
  const navigate = useNavigate()
  const setUser = useStore((state) => state.setUser)
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
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      const response = await authApi.getGoogleAuthUrl()
      window.location.href = response.url
    } catch (error) {
      setError('Failed to initiate Google sign in. Please try again.')
    }
  }

  const handleGoogleSignUp = async () => {
    await handleGoogleSignIn()
  }

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
    
    if (isLoading) {
      return
    }
    
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
    
    try {
      const response = await authApi.login({ email, password })
      
      localStorage.setItem('mokogo-access-token', response.accessToken)
      if (response.refreshToken) {
        localStorage.setItem('mokogo-refresh-token', response.refreshToken)
      }
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.email.split('@')[0],
        phone: '',
      })
      
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a minute and try again.')
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) {
      return
    }
    
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

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
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
    
    try {
      const phoneNumber = `+91${phone.replace(/\D/g, '')}`
      await authApi.signup({
        name: name.trim(),
        email: email.trim(),
        phoneNumber,
        password,
        termsAccepted: agreeToTerms,
      })
      
      const loginResponse = await authApi.login({ email: email.trim(), password })
      
      localStorage.setItem('mokogo-access-token', loginResponse.accessToken)
      if (loginResponse.refreshToken) {
        localStorage.setItem('mokogo-refresh-token', loginResponse.refreshToken)
      }
      
      setUser({
        id: loginResponse.user.id,
        email: loginResponse.user.email,
        name: name.trim(),
        phone: phone,
      })
      
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Too many signup attempts. Please wait a minute and try again.')
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(value)
    setError('')
  }

  const displayPhone = formatPhoneNumber(phone)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex flex-col">
      <Header />
      <SocialSidebar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-11 pb-12 sm:pt-12 sm:pb-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%)]" />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              
              {/* Left Section - Informational Panel */}
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-200/50 border border-orange-300/50 rounded-full backdrop-blur-sm">
                  <Shield className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-800">Secure Authentication</span>
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      MOKOGO
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    Create your account in seconds and start listing your property to thousands of verified flatmate seekers.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">Quick Setup</h3>
                      <p className="text-gray-600 text-sm">Get verified in under 2 minutes with phone OTP authentication</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">Bank-Level Security</h3>
                      <p className="text-gray-600 text-sm">Your phone number is encrypted and never shared publicly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">Trusted Community</h3>
                      <p className="text-gray-600 text-sm">Join 50,000+ verified users on India's safest flatmate platform</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card */}
                <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/50 p-5 shadow-xl shadow-orange-100/40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_55%)]" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-base">PS</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <h4 className="font-semibold text-gray-900 text-sm">Priya Sharma</h4>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 italic leading-relaxed">
                        "Found my perfect flatmate in 5 days! The verification process made me feel completely safe."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Auth Form */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-orange-200/50 shadow-2xl shadow-orange-100/40 p-8">
                {/* Tab Switcher */}
                <div className="flex gap-2 mb-6 bg-orange-50/50 p-1 rounded-lg">
                      <button
                        onClick={() => {
                          setAuthMode('signin')
                          setError('')
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          authMode === 'signin'
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                            : 'text-gray-600 hover:text-orange-500 hover:bg-white/50'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthMode('signup')
                          setError('')
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                          authMode === 'signup'
                            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                            : 'text-gray-600 hover:text-orange-500 hover:bg-white/50'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {authMode === 'signin' ? (
                      <>
                        {/* Heading */}
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                          Welcome Back
                        </h2>

                        {/* Form */}
                        <form onSubmit={handleSignInSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                              className={`w-full px-3.5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                error && !password 
                                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                  : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
                              placeholder="Enter your email"
                              disabled={isLoading}
                              autoFocus
                            />
                          </div>

                          <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value)
                                  setError('')
                                }}
                                className={`w-full px-3.5 py-3 pr-10 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  error && password 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-sm text-red-600">{error}</p>
                            </div>
                          )}

                          {/* Remember me and Forgot password */}
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-orange-500 border-orange-300 rounded focus:ring-orange-400 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                              Forgot password?
                            </a>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!email || !password || isLoading}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                              <div className="w-full border-t border-orange-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-3 bg-white/90 text-gray-500 font-medium">Or continue with</span>
                            </div>
                          </div>
                        </div>

                    {/* Sign in with Google */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center py-4 px-6 border-2 border-orange-400 rounded-lg bg-white text-orange-400 font-medium text-base hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <form onSubmit={handleSignUpSubmit} className="space-y-5">
                          <div>
                            <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-2">
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
                              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                error && !email && !phone && !password && !confirmPassword 
                                  ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                  : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
                              placeholder="Enter your name"
                              disabled={isLoading}
                              autoFocus
                            />
                          </div>

{/* Email */}
<div>
  <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
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
    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
      error && email
        ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
        : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
    placeholder="Enter your email"
    disabled={isLoading}
  />
</div>

{/* Phone Number */}
<div>
  <label htmlFor="signup-phone" className="block text-sm font-semibold text-gray-700 mb-2">
    Phone Number
  </label>
  <div className="flex gap-2">
    <div className="flex-shrink-0">
      <div className="relative">
        <select
          className="w-24 px-3 py-3.5 border-2 border-orange-200 rounded-xl bg-white/80 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 hover:border-orange-300 transition-all"
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
        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
          error && phone
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
        placeholder="Enter your phone number"
        maxLength={12}
        disabled={isLoading}
      />
    </div>
  </div>
</div>

                          <div>
                            <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                id="signup-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value)
                                  setError('')
                                }}
                                className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  error && password && !confirmPassword 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
                                placeholder="Enter your password"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value)
                                  setError('')
                                }}
                                className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                  error && confirmPassword 
                                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                                    : 'border-orange-200 focus:ring-orange-400 focus:border-orange-400'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-white/80 hover:border-orange-300'}`}
                                placeholder="Confirm your password"
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* Terms and Privacy Policy Checkbox */}
                          <div className="flex items-start gap-3">
                            <input
                              id="agree-terms"
                              type="checkbox"
                              checked={agreeToTerms}
                              onChange={(e) => {
                                setAgreeToTerms(e.target.checked)
                                setError('')
                              }}
                              className="w-4 h-4 mt-1 text-orange-500 border-orange-300 rounded focus:ring-orange-400 cursor-pointer"
                            />
                            <label htmlFor="agree-terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                              I agree to the{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setModalType('terms')
                                  setShowModal(true)
                                }}
                                className="font-semibold text-orange-500 hover:text-orange-600 underline transition-colors"
                              >
                                Terms of Service
                              </button>
                              {' '}and{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setModalType('privacy')
                                  setShowModal(true)
                                }}
                                className="font-semibold text-orange-500 hover:text-orange-600 underline transition-colors"
                              >
                                Privacy Policy
                              </button>
                            </label>
                          </div>
                          
                          {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-sm text-red-600">{error}</p>
                            </div>
                          )}

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!name || !email || phone.length !== 10 || !password || !confirmPassword || !agreeToTerms || isLoading}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                              <div className="w-full border-t border-orange-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-3 bg-white/90 text-gray-500 font-medium">Or continue with</span>
                            </div>
                          </div>
                        </div>

                    {/* Sign up with Google */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center py-4 px-6 border-2 border-orange-400 rounded-lg bg-white text-orange-400 font-medium text-base hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="mt-6 pt-6 border-t border-orange-200 flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-600 font-medium">256-bit SSL</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="relative bg-gradient-to-br from-orange-50/50 to-white py-12 px-6 md:px-[10%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { value: '50K+', label: 'Verified Users', icon: Users },
                { value: '15K+', label: 'Active Listings', icon: CheckCircle },
                { value: '4.8', label: 'User Rating', icon: Shield, isRating: true },
                { value: '₹2Cr+', label: 'Brokerage Saved', icon: Zap }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-center group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {stat.isRating ? (
                        <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ) : (
                        <stat.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1.5">
                      {stat.isRating ? (
                        <span className="flex items-center justify-center gap-1">
                          <span>{stat.value}</span>
                          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </span>
                      ) : (
                        stat.value
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Verify Section */}
        <section className="relative bg-white py-16 px-6 md:px-[10%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-50/50 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-700 mb-4">
                Why Verify?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Your safety and privacy come first
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We've built multiple layers of security to keep you and your information safe
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: CheckCircle,
                  title: 'Verified Community',
                  description: 'All users are verified with phone OTP and government ID for maximum safety',
                  color: 'from-green-400 to-green-500'
                },
                {
                  icon: Lock,
                  title: 'Number Privacy',
                  description: 'Your phone number stays private and is never shared with other users',
                  color: 'from-orange-400 to-orange-500'
                },
                {
                  icon: Shield,
                  title: 'Data Protection',
                  description: 'Bank-level encryption ensures your personal information stays secure',
                  color: 'from-purple-400 to-purple-500'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 p-8 shadow-xl shadow-orange-100/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_55%)]" />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative bg-gradient-to-br from-orange-50/50 to-white py-16 px-6 md:px-[10%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-700 mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What our users say
              </h2>
              <p className="text-lg text-gray-600">
                Trusted by thousands of property owners
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Rahul Verma',
                  location: 'Bangalore',
                  quote: '"The verification process was so quick and easy! I felt safe knowing everyone on the platform is verified. Found my flatmate in just 3 days."',
                  initials: 'RV',
                  gradient: 'from-blue-400 to-blue-600'
                },
                {
                  name: 'Anjali Desai',
                  location: 'Pune',
                  quote: '"Love that my phone number stays private! The OTP verification gave me confidence that I\'m dealing with real, verified people."',
                  initials: 'AD',
                  gradient: 'from-purple-400 to-purple-600'
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 p-8 shadow-xl shadow-orange-100/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_55%)]" />
                  <div className="relative">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-white font-semibold text-lg">{testimonial.initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative bg-white py-16 px-6 md:px-[10%]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-orange-50/50 via-transparent to-transparent" />
          <div className="relative max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-700 mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Common questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything about phone verification
              </p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {[
                {
                  question: 'Why do I need to verify my phone number?',
                  answer: 'Phone verification ensures all users are real people, creating a safe and trusted community. It also helps us prevent spam and protect your account.'
                },
                {
                  question: 'Will my phone number be shared publicly?',
                  answer: 'Never! Your phone number is kept completely private and encrypted. Other users cannot see it. All communication happens through secure in-app messaging.'
                },
                {
                  question: 'What if I don\'t receive the OTP?',
                  answer: 'You can request a new OTP after 90 seconds. If you still don\'t receive it, check your phone\'s SMS settings or try again after a few minutes. Contact support if the issue persists.'
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Yes! We use bank-level 256-bit SSL encryption to protect your information. Your data is stored on secure servers and never shared with third parties.'
                }
              ].map((faq, index) => {
                const isExpanded = expandedFaq === index
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50/50 to-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_55%)]" />
                    <div className="relative p-6">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className={`font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors flex-1 ${isExpanded ? 'text-orange-600' : ''}`}>
                          {faq.question}
                        </h3>
                        <ChevronDown 
                          className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 mt-4' : 'max-h-0 mt-0'}`}>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Terms/Privacy Modal */}
      <TermsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
      />
    </div>
  )
}

export default Auth
