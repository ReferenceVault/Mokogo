import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import { useStore } from '@/store/useStore'
import { authApi } from '@/services/api'

const GoogleCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setUser = useStore((state) => state.setUser)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const hasExchanged = useRef(false)

  useEffect(() => {
    // Prevent duplicate requests (React StrictMode in development)
    if (hasExchanged.current) {
      return
    }

    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam)
      setError(decodedError || 'Google authentication failed. Please try again.')
      setIsLoading(false)
      return
    }

    if (!code) {
      setError('Invalid callback parameters. Please try signing in again.')
      setIsLoading(false)
      return
    }

    const exchangeCode = async () => {
      // Mark as processing to prevent duplicate calls
      hasExchanged.current = true

      try {
        const result = await authApi.googleCallback(code)

        localStorage.setItem('mokogo-access-token', result.accessToken)
        if (result.refreshToken) {
          localStorage.setItem('mokogo-refresh-token', result.refreshToken)
        }

        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name || '',
          phone: '',
        })

        // Get redirect params from URL (passed through Google OAuth state)
        // For now, default to dashboard - in production, you'd pass state through OAuth flow
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPath = urlParams.get('redirect') || '/dashboard'
        const redirectView = urlParams.get('view') || null
        const redirectTab = urlParams.get('tab') || null
        const params = new URLSearchParams()
        if (redirectView) params.set('view', redirectView)
        if (redirectTab) params.set('tab', redirectTab)
        const queryString = params.toString()
        const redirectUrl = queryString ? `${redirectPath}?${queryString}` : redirectPath

        setTimeout(() => {
          navigate(redirectUrl)
        }, 500)
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'Failed to complete Google authentication. Please try again.'
        )
        setIsLoading(false)
      }
    }

    exchangeCode()
  }, [searchParams, navigate, setUser])

  return (
    <div className="bg-mokogo-off-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-mokogo-gray p-8">
            <div className="text-center">
              <Logo />

              {isLoading ? (
                <>
                  <div className="mt-6 flex justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-orange-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-600">Completing authentication...</p>
                </>
              ) : error ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    Authentication Failed
                  </h2>
                  <p className="text-red-600 mt-2 mb-6">{error}</p>
                  <button
                    onClick={() => navigate('/auth')}
                    className="btn-primary w-full"
                  >
                    Back to Sign In
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default GoogleCallback
