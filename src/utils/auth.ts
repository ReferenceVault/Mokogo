/**
 * Authentication utility functions
 * Centralized auth-related functions to avoid code duplication
 */

import { authApi } from '@/services/api'
import { useStore } from '@/store/useStore'
import { websocketService } from '@/services/websocket'

/**
 * Logout utility function
 * Clears user session, removes tokens from localStorage, and navigates to auth page
 * @param navigate - Navigation function from react-router-dom
 */
export const handleLogout = async (navigate: (path: string) => void) => {
  const { setUser, setCurrentListing, setAllListings, setRequests } = useStore.getState()
  
  try {
    // Disconnect WebSocket before logout
    websocketService.disconnect()
    await authApi.logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Ensure WebSocket is disconnected even if logout API fails
    websocketService.disconnect()
    setUser(null)
    setCurrentListing(null)
    setAllListings([])
    setRequests([])
    localStorage.removeItem('mokogo-user')
    localStorage.removeItem('mokogo-listing')
    localStorage.removeItem('mokogo-all-listings')
    localStorage.removeItem('mokogo-requests')
    localStorage.removeItem('mokogo-access-token')
    localStorage.removeItem('mokogo-refresh-token')
    navigate('/auth')
  }
}
