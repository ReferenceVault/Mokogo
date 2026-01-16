import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '@/components/Logo'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { authApi } from '@/services/api'
import { useStore } from '@/store/useStore'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useStore((state) => state.setUser)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    try {
      const response = await authApi.login({ email: email.trim(), password })
      if (!response.user.roles?.includes('admin')) {
        setError('You do not have admin access.')
        return
      }

      localStorage.setItem('mokogo-access-token', response.accessToken)
      if (response.refreshToken) {
        localStorage.setItem('mokogo-refresh-token', response.refreshToken)
      }

      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name || response.user.email.split('@')[0],
        phone: '',
        roles: response.user.roles
      } as any)

      navigate('/admin/dashboard')
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-orange-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-orange-200/50 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-transparent rounded-2xl" />
            
            <div className="relative">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h1>
                <p className="text-gray-600">Enter your credentials to access the admin panel</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="admin@mokogo.in"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Admin access only. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLogin

