import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import UserAvatar from './UserAvatar'
import { useStore } from '@/store/useStore'
import { useEffect, useState, useRef } from 'react'
import { handleLogout as handleLogoutUtil } from '@/utils/auth'
import { usersApi } from '@/services/api'

interface HeaderProps {
  forceGuest?: boolean
}

const Header = ({ forceGuest = false }: HeaderProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const setCurrentListing = useStore((state) => state.setCurrentListing)
  // Initialize authentication state synchronously to avoid flash of wrong button
  const checkAuthSync = () => {
    const accessToken = localStorage.getItem('mokogo-access-token')
    const savedUser = localStorage.getItem('mokogo-user')
    let currentUser = user
    if (!currentUser && savedUser) {
      try {
        currentUser = JSON.parse(savedUser)
      } catch (e) {
        console.error('Error parsing saved user:', e)
      }
    }
    return !!(accessToken && currentUser) && !forceGuest
  }

  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthSync)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const profileFetchRef = useRef<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const accessToken = localStorage.getItem('mokogo-access-token')
      const savedUser = localStorage.getItem('mokogo-user')
      let currentUser = user
      if (!currentUser && savedUser) {
        try {
          currentUser = JSON.parse(savedUser)
        } catch (e) {
          console.error('Error parsing saved user:', e)
        }
      }
      
      const authenticated = !!(accessToken && currentUser) && !forceGuest
      setIsAuthenticated(authenticated)
    }
    
    checkAuth()
    
    // Listen for storage changes (when user logs in from another tab/window)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically in case user logs in on same page
    const interval = setInterval(checkAuth, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user, forceGuest])

  // Fetch user profile if profileImageUrl is missing
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.id) return
      
      // Only fetch if profileImageUrl is missing
      if ((user as any).profileImageUrl) return
      
      // Prevent multiple simultaneous fetches for the same user
      if (profileFetchRef.current === user.id) return
      profileFetchRef.current = user.id
      
      try {
        const profile = await usersApi.getMyProfile()
        // Only update if profileImageUrl is actually present and different
        if (profile.profileImageUrl && profile.profileImageUrl !== (user as any).profileImageUrl) {
          const updatedUser = { ...user, ...profile }
          setUser(updatedUser as any)
        }
      } catch (error) {
        console.error('Error fetching user profile in Header:', error)
      } finally {
        // Reset after a delay to allow retry if needed
        setTimeout(() => {
          if (profileFetchRef.current === user.id) {
            profileFetchRef.current = null
          }
        }, 5000)
      }
    }
    
    fetchProfile()
  }, [isAuthenticated, user?.id, setUser])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const currentPath = location.pathname
  const redirectTarget = encodeURIComponent(location.pathname + location.search)
  const showDashboardCta =
    currentPath === '/' ||
    currentPath.startsWith('/explore') ||
    currentPath.startsWith('/how-it-works')

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    if (path === '/listing') {
      return currentPath.startsWith('/listing') && !currentPath.startsWith('/listings')
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

        {/* Right section with Log in button, Dashboard button, and/or User menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {showDashboardCta && (
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
              )}
              <div className="relative" ref={userMenuRef}>
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {(() => {
                      // Get current user from store or localStorage
                      const savedUser = localStorage.getItem('mokogo-user')
                      let currentUser = user
                      if (!currentUser && savedUser) {
                        try {
                          currentUser = JSON.parse(savedUser)
                        } catch (e) {
                          console.error('Error parsing saved user:', e)
                        }
                      }
                      
                      return (
                        <UserAvatar 
                          user={{ 
                            name: currentUser?.name, 
                            profileImageUrl: (currentUser as any)?.profileImageUrl 
                          }}
                          size="md"
                          showBorder={false}
                          className="shadow-lg bg-gradient-to-br from-orange-400 to-orange-500"
                        />
                      )
                    })()}
                  </div>
                </div>

                {showUserMenu && (() => {
                  // Get current user from store or localStorage
                  const savedUser = localStorage.getItem('mokogo-user')
                  let currentUser = user
                  if (!currentUser && savedUser) {
                    try {
                      currentUser = JSON.parse(savedUser)
                    } catch (e) {
                      console.error('Error parsing saved user:', e)
                    }
                  }
                  
                  return (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-200/50 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-orange-100">
                        <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
                      </div>
                      <Link
                        to="/dashboard?view=profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleLogoutUtil(navigate)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )
                })()}
              </div>
            </>
          ) : (
            <Link 
              to={`/auth?redirect=${redirectTarget}`} 
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
