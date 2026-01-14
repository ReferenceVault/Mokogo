import { Navigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { usersApi } from '@/services/api'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Helper to validate JWT token format (basic check)
const isValidTokenFormat = (token: string): boolean => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // Try to decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token has expired (if exp claim exists)
    if (payload.exp) {
      const expirationTime = payload.exp * 1000 // Convert to milliseconds
      if (Date.now() >= expirationTime) {
        return false // Token has expired
      }
    }
    
    return true
  } catch (error) {
    return false
  }
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      // Check authentication on mount
      const accessToken = localStorage.getItem('mokogo-access-token')
      const savedUser = localStorage.getItem('mokogo-user')

      // If no token or user, redirect immediately
      if (!accessToken || !savedUser) {
        // Clear any stale data
        localStorage.removeItem('mokogo-user')
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        setUser(null)
        setIsChecking(false)
        setShouldRedirect(true)
        return
      }

      // Validate token format and expiration
      if (!isValidTokenFormat(accessToken)) {
        // Token is invalid or expired, clear it
        localStorage.removeItem('mokogo-user')
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        setUser(null)
        setIsChecking(false)
        setShouldRedirect(true)
        return
      }

      // If token exists but user state is not loaded, try to load it
      let currentUser = user
      if (!currentUser && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          currentUser = parsedUser
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('mokogo-user')
          localStorage.removeItem('mokogo-access-token')
          localStorage.removeItem('mokogo-refresh-token')
          setUser(null)
          setIsChecking(false)
          setShouldRedirect(true)
          return
        }
      }

      // Fetch full profile if user exists but doesn't have profileImageUrl
      if (currentUser && !(currentUser as any).profileImageUrl) {
        try {
          const profile = await usersApi.getMyProfile()
          // Merge profile data with existing user data
          const updatedUser = { ...currentUser, ...profile }
          setUser(updatedUser as any)
        } catch (error) {
          console.error('Error fetching user profile:', error)
          // Continue even if profile fetch fails
        }
      }

      setIsChecking(false)
    }

    checkAuthAndFetchProfile()
  }, [setUser]) // Removed 'user' from dependencies to prevent infinite loops

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mokogo-off-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mokogo-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle redirect after checking is complete
  if (shouldRedirect) {
    return <Navigate to="/auth" replace />
  }

  // Final check if user is authenticated
  const accessToken = localStorage.getItem('mokogo-access-token')
  const savedUser = localStorage.getItem('mokogo-user')
  
  let currentUser = user
  if (!currentUser && savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
    } catch (error) {
      console.error('Error parsing saved user in render:', error)
      currentUser = null
    }
  }

  if (!accessToken || !currentUser || !isValidTokenFormat(accessToken)) {
    // Don't call setState here - use shouldRedirect state instead
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

