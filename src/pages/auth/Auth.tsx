import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TermsModal from '@/components/TermsModal'

import { authApi, usersApi } from '@/services/api'
import { useStore } from '@/store/useStore'
import SocialSidebar from '@/components/SocialSidebar'
import { Shield, Zap, Users, Lock, Eye, EyeOff } from 'lucide-react'

const Auth = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setUser = useStore((state) => state.setUser)
  const toggleSavedListing = useStore((state) => state.toggleSavedListing)
  const isListingSaved = useStore((state) => state.isListingSaved)
  const setSavedListings = useStore((state) => state.setSavedListings)

  const storedRedirect = typeof window !== 'undefined'
    ? sessionStorage.getItem('mokogo-auth-redirect')
    : null
  const parsedRedirect = storedRedirect ? JSON.parse(storedRedirect) : null

  // Get redirect params from URL or stored session
  const redirectPath = searchParams.get('redirect') || parsedRedirect?.path || '/dashboard'
  const redirectView = searchParams.get('view') || parsedRedirect?.view || null
  const redirectTab = searchParams.get('tab') || parsedRedirect?.tab || null
  const redirectListing = searchParams.get('listing') || parsedRedirect?.listingId || null
  const redirectFocus = searchParams.get('focus') || parsedRedirect?.focus || null
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
  const user = useStore((state) => state.user)

  // Redirect if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('mokogo-access-token')
      const savedUser = localStorage.getItem('mokogo-user')
      const currentUser = user || (savedUser ? JSON.parse(savedUser) : null)
      
      if (accessToken && currentUser) {
        // User is already logged in, redirect them
        const params = new URLSearchParams()
        if (redirectView) params.set('view', redirectView)
        if (redirectTab) params.set('tab', redirectTab)
        if (redirectListing) params.set('listing', redirectListing)
        if (redirectFocus) params.set('focus', redirectFocus)
        const queryString = params.toString()
        const redirectUrl = queryString ? `${redirectPath}?${queryString}` : redirectPath
        navigate(redirectUrl, { replace: true })
      }
    }
    
    checkAuth()
  }, [user, navigate, redirectPath, redirectView, redirectTab, redirectListing, redirectFocus])

  const syncSavedListings = async (serverIds?: string[]) => {
    const localRaw = localStorage.getItem('mokogo-saved-listings')
    const localIds: string[] = localRaw ? JSON.parse(localRaw) : []
    const merged = Array.from(new Set([...(serverIds || []), ...localIds]))

    if (!serverIds || merged.length !== serverIds.length) {
      const toAdd = merged.filter((id) => !serverIds?.includes(id))
      if (toAdd.length) {
        await Promise.all(toAdd.map((id) => usersApi.saveListing(id).catch(() => null)))
      }
      const refreshed = await usersApi.getSavedListings()
      setSavedListings(refreshed)
      return
    }

    if (serverIds) {
      setSavedListings(serverIds)
    }
  }

  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'signup' || modeParam === 'signin') {
      setAuthMode(modeParam)
    }
  }, [searchParams])

  const applyPendingSavedListing = async () => {
    const pendingId = localStorage.getItem('mokogo-pending-saved-listing')
    if (pendingId) {
      try {
        const updated = await usersApi.saveListing(pendingId)
        setSavedListings(updated)
      } catch (error) {
        if (!isListingSaved(pendingId)) {
          toggleSavedListing(pendingId)
        }
      }
    }
    if (pendingId) {
      localStorage.removeItem('mokogo-pending-saved-listing')
    }
  }

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

      await syncSavedListings(response.user.savedListings)
      await applyPendingSavedListing()
      
      // Navigate to redirect path with view and tab params if provided
      const params = new URLSearchParams()
      if (redirectView) params.set('view', redirectView)
      if (redirectTab) params.set('tab', redirectTab)
      if (redirectListing) params.set('listing', redirectListing)
      if (redirectFocus) params.set('focus', redirectFocus)
      const queryString = params.toString()
      const redirectUrl = queryString ? `${redirectPath}?${queryString}` : redirectPath
      sessionStorage.removeItem('mokogo-auth-redirect')
      navigate(redirectUrl)
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

    if (phone && !validatePhone(phone)) {
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
      const signupData: any = {
        name: name.trim(),
        email: email.trim(),
        password,
        termsAccepted: agreeToTerms,
      }
      
      if (phone && phone.replace(/\D/g, '').length === 10) {
        signupData.phoneNumber = `+91${phone.replace(/\D/g, '')}`
      }
      
      await authApi.signup(signupData)
      
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

      await syncSavedListings(loginResponse.user.savedListings)
      await applyPendingSavedListing()
      
      // Navigate to redirect path with view and tab params if provided
      const params = new URLSearchParams()
      if (redirectView) params.set('view', redirectView)
      if (redirectTab) params.set('tab', redirectTab)
      if (redirectListing) params.set('listing', redirectListing)
      if (redirectFocus) params.set('focus', redirectFocus)
      const queryString = params.toString()
      const redirectUrl = queryString ? `${redirectPath}?${queryString}` : redirectPath
      sessionStorage.removeItem('mokogo-auth-redirect')
      navigate(redirectUrl)
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
              <div className="space-y-10 mt-[3.5rem]">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-200/50 border border-orange-300/50 rounded-full backdrop-blur-sm">
                  <Shield className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-800">Secure Authentication</span>
                </div>

                {/* Main Heading */}
                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      MOKOGO
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    Real rooms. Real flatmates. No brokers.
                  </p>
                  <p className="text-sm md:text-base">
                    <span className="text-orange-600">Currently live in Pune.</span>{' '}
                    <span className="text-gray-600">Expanding soon.</span>
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">Your privacy comes first</h3>
                      <p className="text-gray-600 text-sm">Your contact details are not shown publicly. You decide when to share.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">No brokers. No spam. No pressure</h3>
                      <p className="text-gray-600 text-sm">Connect directly with owners and flatmates. We actively remove fake and outdated listings.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">Early-access community 💛</h3>
                      <p className="text-gray-600 text-sm">You're joining Mokogo at an early stage as we build it city by city. We'd love your feedback.</p>
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
                            <Link to="/auth/forgot-password" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                              Forgot password?
                            </Link>
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
                      <span className="text-xs text-gray-600">Your contact details are never shared without your permission</span>
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
    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
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
                            disabled={!name || !email || !password || !confirmPassword || !agreeToTerms || isLoading}
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
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">Encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">Private</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-mokogo-gray flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-xs text-gray-600">Your contact details are never shared without your permission</span>
                    </div>
                  </>
                )}
              </div>
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
