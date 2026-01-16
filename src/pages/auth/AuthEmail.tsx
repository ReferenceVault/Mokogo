import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'

const AuthEmail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setUser = useStore((state) => state.setUser)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const storedRedirect = typeof window !== 'undefined'
    ? sessionStorage.getItem('mokogo-auth-redirect')
    : null
  const parsedRedirect = storedRedirect ? JSON.parse(storedRedirect) : null
  const redirectPath = searchParams.get('redirect') || parsedRedirect?.path || '/dashboard'
  const redirectView = searchParams.get('view') || parsedRedirect?.view || null
  const redirectTab = searchParams.get('tab') || parsedRedirect?.tab || null
  const redirectListing = searchParams.get('listing') || parsedRedirect?.listingId || null
  const redirectFocus = searchParams.get('focus') || parsedRedirect?.focus || null

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Create user profile
    const phone = sessionStorage.getItem('auth-phone') || ''
    const user = {
      id: `user-${Date.now()}`,
      phone,
      email,
      name: name.trim(),
    }

    setUser(user)
    sessionStorage.removeItem('auth-phone')

    const params = new URLSearchParams()
    if (redirectView) params.set('view', redirectView)
    if (redirectTab) params.set('tab', redirectTab)
    if (redirectListing) params.set('listing', redirectListing)
    if (redirectFocus) params.set('focus', redirectFocus)
    const queryString = params.toString()
    const redirectUrl = queryString ? `${redirectPath}?${queryString}` : redirectPath
    sessionStorage.removeItem('mokogo-auth-redirect')
    navigate(redirectUrl)
  }

  return (
    <div className="bg-mokogo-off-white min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Centered Layout */}
      <main className="flex-1 flex items-center py-12 px-16" style={{ fontSize: '90%' }}>
        <div className="max-w-2xl mx-auto w-full px-24">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h1>
            <p className="text-lg text-gray-600">
              We'll use this information to personalize your experience.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg border border-mokogo-gray p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError('')
                    }}
                    className={`input-field ${error && !name.trim() ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    className={`input-field pr-10 ${error && (!email.trim() || !validateEmail(email)) ? 'border-red-500 focus:ring-red-500' : 'focus:ring-mokogo-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 mt-2">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Info Message */}
                <div className="flex items-start gap-2 mt-3">
                  <svg className="w-5 h-5 text-mokogo-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    We'll never spam you or share your email with anyone.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to listing</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Terms & Privacy */}
            <div className="mt-6 pt-6 border-t border-mokogo-gray">
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to MOKOGO's{' '}
                <a href="#" className="text-mokogo-primary hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-mokogo-primary hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* What You'll Receive Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What you'll receive via email
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed about your listings and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* New Interest Alerts */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">New Interest Alerts</h3>
              <p className="text-gray-600 text-sm">
                Get notified when verified seekers show interest in your listing.
              </p>
            </div>

            {/* Performance Updates */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-mokogo-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Updates</h3>
              <p className="text-gray-600 text-sm">
                Weekly insights on views, responses, and engagement metrics.
              </p>
            </div>

            {/* Expert Tips */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Tips</h3>
              <p className="text-gray-600 text-sm">
                Personalized advice to improve your listing and attract quality tenants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Preferences & Control Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Email Preferences & Control
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Essential Notifications Only */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-full bg-mokogo-primary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Notifications Only</h3>
              <p className="text-gray-600 text-sm">
                We only send emails that matter - new inquiries, booking confirmations, and critical account updates. No marketing spam.
              </p>
            </div>

            {/* Customizable Frequency */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-full bg-mokogo-primary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customizable Frequency</h3>
              <p className="text-gray-600 text-sm">
                Choose daily, weekly, or instant notifications. Adjust your preferences anytime from your account settings.
              </p>
            </div>

            {/* Easy Unsubscribe */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="w-12 h-12 rounded-full bg-mokogo-primary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Unsubscribe</h3>
              <p className="text-gray-600 text-sm">
                One-click unsubscribe from any email type. You're always in control of what lands in your inbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Email Security Matters Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Email Security Matters
            </h2>
            <p className="text-lg text-gray-600">
              We take your privacy seriously with industry-leading protection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Encrypted Storage */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-mokogo-primary/10 flex items-center justify-center mb-4 relative">
                <svg className="w-6 h-6 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <svg className="w-4 h-4 text-mokogo-primary absolute bottom-0 right-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Encrypted Storage</h3>
              <p className="text-gray-600 text-sm">
                Your email is encrypted using AES-256 encryption standards
              </p>
            </div>

            {/* No Third-Party Sharing */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Third-Party Sharing</h3>
              <p className="text-gray-600 text-sm">
                We never sell or share your email with external parties
              </p>
            </div>

            {/* Verified Sender */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 relative">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg className="w-4 h-4 text-purple-600 absolute -bottom-1 -right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Sender</h3>
              <p className="text-gray-600 text-sm">
                All emails from MOKOGO are authenticated and verified
              </p>
            </div>

            {/* Right to Delete */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Right to Delete</h3>
              <p className="text-gray-600 text-sm">
                Request complete deletion of your data anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Listers Say Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What Listers Say About Our Updates
            </h2>
            <p className="text-lg text-gray-600">
              Real feedback from property owners on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                "I love getting instant email alerts when someone views my listing. Helped me respond quickly and find a tenant within 3 days!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">AP</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Arjun Patel</div>
                  <div className="text-sm text-gray-600">Mumbai</div>
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
                "The weekly performance reports are super helpful. I optimized my listing based on the insights and doubled my inquiries!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">SK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sneha Kapoor</div>
                  <div className="text-sm text-gray-600">Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-mokogo-gray">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Finally, a platform that doesn't spam! Only get emails that matter. Clean inbox, faster responses, better tenants."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">VS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Vikram Singh</div>
                  <div className="text-sm text-gray-600">Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Emails Section */}
      <section className="bg-white py-16 px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Types of Emails You'll Receive
            </h2>
            <p className="text-lg text-gray-600">
              Transparent breakdown of all communication from MOKOGO
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Inquiry Notifications */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-mokogo-primary flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">New Inquiry Notifications</h3>
                <span className="px-3 py-1 bg-mokogo-primary/20 text-mokogo-primary-dark rounded-full text-xs font-medium">Instant</span>
              </div>
              <p className="text-gray-600 text-sm">
                Instant alerts when verified seekers express interest in your listing
              </p>
            </div>

            {/* Message Notifications */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Message Notifications</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Real-time</span>
              </div>
              <p className="text-gray-600 text-sm">
                Get notified when seekers send you messages or respond to your queries
              </p>
            </div>

            {/* Visit Reminders */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center mb-4 relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg className="w-4 h-4 text-white absolute -bottom-1 -right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Visit Reminders</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Scheduled</span>
              </div>
              <p className="text-gray-600 text-sm">
                Scheduled property visit reminders and confirmation updates
              </p>
            </div>

            {/* Weekly Performance Report */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Performance Report</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Weekly</span>
              </div>
              <p className="text-gray-600 text-sm">
                Detailed analytics on views, responses, and engagement metrics
              </p>
            </div>

            {/* Listing Optimization Tips */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-pink-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Listing Optimization Tips</h3>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">Bi-weekly</span>
              </div>
              <p className="text-gray-600 text-sm">
                Personalized suggestions to improve your listing performance
              </p>
            </div>

            {/* Security Alerts */}
            <div className="bg-mokogo-off-white rounded-lg p-6 border border-mokogo-gray">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">As needed</span>
              </div>
              <p className="text-gray-600 text-sm">
                Important account security notifications and login alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Email Preview Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              See what our emails actually look like
            </h2>
          </div>

          {/* Email Preview Card */}
          <div className="bg-white rounded-lg shadow-lg border border-mokogo-gray overflow-hidden">
            {/* Email Header */}
            <div className="bg-mokogo-primary px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-mokogo-primary font-bold text-lg">M</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">MOKOGO</div>
                    <div className="text-white/90 text-sm">notifications@mokogo.com</div>
                  </div>
                </div>
                <div className="text-white/90 text-sm">2 mins ago</div>
              </div>
              <div className="text-white text-xl font-semibold">
                New Inquiry for Your Listing
              </div>
            </div>

            {/* Email Body */}
            <div className="px-6 py-6">
              <p className="text-gray-900 mb-4">Hi there,</p>
              <p className="text-gray-700 mb-6">
                Great news! A verified seeker has shown interest in your property listing:
              </p>

              {/* Seeker Information Card */}
              <div className="bg-mokogo-off-white rounded-lg p-4 border border-mokogo-gray mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xl">RK</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Rohit Kumar</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">Software Engineer • 27 years old</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Verified ID
                      </span>
                      <span className="px-3 py-1 bg-mokogo-primary/20 text-mokogo-primary-dark rounded-full text-xs font-medium">
                        Background Checked
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeker's Message */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                  <svg className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700 italic">
                    "Looking for a quiet place close to my office. Your listing looks perfect! Would love to schedule a visit."
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button className="px-6 py-3 bg-mokogo-primary text-white rounded-lg font-medium hover:bg-mokogo-primary-dark transition-colors">
                  View Full Profile
                </button>
                <button className="px-6 py-3 bg-white text-mokogo-primary border-2 border-mokogo-primary rounded-lg font-medium hover:bg-mokogo-info-bg transition-colors">
                  Send Message
                </button>
              </div>

              {/* Listing Details */}
              <div className="border-t border-mokogo-gray pt-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Your listing details:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">2BHK, Koramangala</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">₹25,000/month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Footer */}
            <div className="px-6 py-4 bg-mokogo-off-white border-t border-mokogo-gray flex items-center justify-between">
              <a href="#" className="text-mokogo-primary text-sm hover:underline">
                Manage Email Preferences
              </a>
              <span className="text-gray-600 text-sm">© 2025 MOKOGO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Email FAQs Section */}
      <section className="bg-mokogo-off-white py-16 px-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Email FAQs
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about email notifications
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-lg p-6 border border-mokogo-gray">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mokogo-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I change my email later?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can update your email address anytime from your account settings. We'll send a verification email to confirm the change.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-lg p-6 border border-mokogo-gray">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mokogo-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How often will I receive emails?
                  </h3>
                  <p className="text-gray-600">
                    You'll receive instant notifications for new inquiries and messages. Performance reports are sent weekly. You can adjust frequency in settings.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-lg p-6 border border-mokogo-gray">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mokogo-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What if emails go to spam?
                  </h3>
                  <p className="text-gray-600">
                    Add notifications@mokogo.com to your contacts. If emails still land in spam, check your email provider's spam settings or whitelist our domain.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-lg p-6 border border-mokogo-gray">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mokogo-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I use multiple email addresses?
                  </h3>
                  <p className="text-gray-600">
                    Each MOKOGO account is linked to one primary email. However, you can forward notifications to multiple addresses using email forwarding rules.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-lg p-6 border border-mokogo-gray">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-mokogo-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Are emails encrypted?
                  </h3>
                  <p className="text-gray-600">
                    Yes, all emails are sent over encrypted connections (TLS). Your email address is also encrypted in our database using industry-standard encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to get started Section */}
      <section className="bg-mokogo-primary py-16 px-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.19 6.35c-2.52 2.69-4.76 6.94-5.19 11.65h2.03c.45-3.53 2.11-7.18 4.16-9.69l-1-2zm5.62 0l-1 2c2.05 2.51 3.71 6.16 4.16 9.69h2.03c-.43-4.71-2.67-8.96-5.19-11.69zm-2.81 12.15c-1.5 0-2.81-.54-3.76-1.44l1.53-1.53c.59.59 1.54.59 2.12 0l1.53 1.53c-.95.9-2.26 1.44-3.42 1.44zm-6-20l-3 3 3 3v-2h5v-2h-5v-2zm14 0v2h-5v2h5v2l3-3-3-3z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Enter your email above and continue to create your first listing. Find the perfect flatmate within days, not weeks.
          </p>

          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">No spam, ever</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">Unsubscribe anytime</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">100% secure</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AuthEmail
