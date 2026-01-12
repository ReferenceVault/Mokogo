import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const setCurrentListing = useStore((state) => state.setCurrentListing)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem('mokogo-access-token')
    const savedUser = localStorage.getItem('mokogo-user')
    const hasUser = user || (savedUser ? JSON.parse(savedUser) : null)
    
    setIsAuthenticated(!!(accessToken && hasUser))
  }, [user])

  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  const handleListYourSpace = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      // Clear any existing listing to start fresh for new listing
      e.preventDefault()
      setCurrentListing(null)
      localStorage.removeItem('mokogo-listing')
      navigate('/listing/wizard')
    }
    // If not authenticated, let the Link handle navigation to /auth
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="transform transition-transform duration-300 hover:scale-105">
          <Logo />
        </div>
        
        {/* Middle section with Menu items */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/explore" 
            className="relative group"
          >
            <span className={`text-sm font-medium transition-all duration-300 ${
              isActive('/explore') || isActive('/city')
                ? 'text-orange-500 font-semibold' 
                : 'text-gray-600 group-hover:text-orange-500'
            }`}>
              Find Your Place
            </span>
            {(isActive('/explore') || isActive('/city')) && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
          </Link>
          
          <Link 
            to="/how-it-works" 
            className="relative group"
          >
            <span className={`text-sm font-medium transition-all duration-300 ${
              isActive('/how-it-works')
                ? 'text-orange-500 font-semibold' 
                : 'text-gray-600 group-hover:text-orange-500'
            }`}>
              How It Works
            </span>
            {isActive('/how-it-works') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
          </Link>
          
        {isAuthenticated ? (
  <button
    onClick={handleListYourSpace}
    className="relative group"
  >
    <span
      className={`text-sm font-medium transition-all duration-300 ${
        isActive('/auth') || isActive('/listing') || isActive('/dashboard')
          ? 'text-orange-500 font-semibold'
          : 'text-gray-600 group-hover:text-orange-500'
      }`}
    >
      List Your Space
    </span>

    {(isActive('/auth') || isActive('/listing') || isActive('/dashboard')) && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
    )}

    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
  </button>
) : (
  <Link
    to="/auth?redirect=/dashboard&view=listings"
    className="relative group"
  >
    <span
      className={`text-sm font-medium transition-all duration-300 ${
        isActive('/auth') || isActive('/listing') || isActive('/dashboard')
          ? 'text-orange-500 font-semibold'
          : 'text-gray-600 group-hover:text-orange-500'
      }`}
    >
      List Your Space
    </span>

    {(isActive('/auth') || isActive('/listing') || isActive('/dashboard')) && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
    )}

    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full group-hover:w-full transition-all duration-300" />
  </Link>
)}

        </nav>

        {/* Right section with Log in button or Dashboard link */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="group relative bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Dashboard
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ) : (
            <Link 
              to="/auth" 
              className="group relative bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Log in
                <svg 
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
