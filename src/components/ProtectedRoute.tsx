import { Navigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Helper to validate JWT token format (basic check)
const decodeJwtPayload = (token: string) => {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch (error) {
    return null
  }
}

const isValidTokenFormat = (token: string): boolean => {
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  if (payload.exp) {
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    if (Date.now() >= expirationTime) {
      return false // Token has expired
    }
  }
  return true
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useStore((state) => state.user)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    const accessToken = localStorage.getItem('mokogo-access-token')
    const savedUser = localStorage.getItem('mokogo-user')

    // If no token or user, redirect immediately
    if (!accessToken || !savedUser) {
      // Clear any stale data
      localStorage.removeItem('mokogo-user')
      localStorage.removeItem('mokogo-access-token')
      localStorage.removeItem('mokogo-refresh-token')
      setIsChecking(false)
      return
    }

    // Validate token format and expiration
    if (!isValidTokenFormat(accessToken)) {
      // Token is invalid or expired, clear it
      localStorage.removeItem('mokogo-user')
      localStorage.removeItem('mokogo-access-token')
      localStorage.removeItem('mokogo-refresh-token')
      useStore.getState().setUser(null)
      setIsChecking(false)
      return
    }

    // If token exists but user state is not loaded, try to load it
    if (!user && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        useStore.getState().setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('mokogo-user')
        localStorage.removeItem('mokogo-access-token')
        localStorage.removeItem('mokogo-refresh-token')
        useStore.getState().setUser(null)
        setIsChecking(false)
        return
      }
    }

    setIsChecking(false)
  }, [user])

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

  // Final check if user is authenticated
  const accessToken = localStorage.getItem('mokogo-access-token')
  const savedUser = localStorage.getItem('mokogo-user')
  const currentUser = user || (savedUser ? JSON.parse(savedUser) : null)

  if (!accessToken || !currentUser || !isValidTokenFormat(accessToken)) {
    // Clear any stale data
    localStorage.removeItem('mokogo-user')
    localStorage.removeItem('mokogo-access-token')
    localStorage.removeItem('mokogo-refresh-token')
    useStore.getState().setUser(null)
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

