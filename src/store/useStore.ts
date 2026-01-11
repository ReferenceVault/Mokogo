import { create } from 'zustand'
import { User, Listing, Request } from '@/types'

interface AppState {
  user: User | null
  currentListing: Listing | null
  allListings: Listing[]
  requests: Request[]
  savedListings: string[] // Array of listing IDs
  setUser: (user: User | null) => void
  setCurrentListing: (listing: Listing | null) => void
  setAllListings: (listings: Listing[]) => void
  addListing: (listing: Listing) => void
  setRequests: (requests: Request[]) => void
  addRequest: (request: Request) => void
  updateRequest: (requestId: string, updates: Partial<Request>) => void
  toggleSavedListing: (listingId: string) => void
  isListingSaved: (listingId: string) => boolean
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  currentListing: null,
  allListings: [],
  requests: [],
  savedListings: [],
  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('mokogo-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('mokogo-user')
    }
  },
  setCurrentListing: (listing) => {
    set({ currentListing: listing })
    if (listing) {
      try {
        // Try to store full listing
        localStorage.setItem('mokogo-listing', JSON.stringify(listing))
      } catch (error) {
        // If quota exceeded, try storing without photos (they're too large)
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, storing listing without photos')
          try {
            const listingWithoutPhotos = { ...listing, photos: [] }
            localStorage.setItem('mokogo-listing', JSON.stringify(listingWithoutPhotos))
            console.log('Stored listing without photos. Photos will need to be re-uploaded.')
          } catch (e) {
            console.error('Failed to store listing even without photos:', e)
            // Still allow the app to work, just don't persist
          }
        } else {
          console.error('Error storing listing:', error)
        }
      }
    } else {
      localStorage.removeItem('mokogo-listing')
    }
  },
  setRequests: (requests) => {
    set({ requests })
    localStorage.setItem('mokogo-requests', JSON.stringify(requests))
  },
  addRequest: (request) =>
    set((state) => {
      const newRequests = [...state.requests, request]
      localStorage.setItem('mokogo-requests', JSON.stringify(newRequests))
      return { requests: newRequests }
    }),
  updateRequest: (requestId, updates) =>
    set((state) => {
      const updatedRequests = state.requests.map((r) =>
        r.id === requestId ? { ...r, ...updates } : r
      )
      localStorage.setItem('mokogo-requests', JSON.stringify(updatedRequests))
      return { requests: updatedRequests }
    }),
  setAllListings: (listings) => {
    set({ allListings: listings })
    try {
      localStorage.setItem('mokogo-all-listings', JSON.stringify(listings))
    } catch (error) {
      console.error('Error storing all listings:', error)
    }
  },
  addListing: (listing) =>
    set((state) => {
      const newListings = [...state.allListings, listing]
      try {
        localStorage.setItem('mokogo-all-listings', JSON.stringify(newListings))
      } catch (error) {
        console.error('Error storing listings:', error)
      }
      return { allListings: newListings }
    }),
  toggleSavedListing: (listingId) =>
    set((state) => {
      const isSaved = state.savedListings.includes(listingId)
      const newSavedListings = isSaved
        ? state.savedListings.filter(id => id !== listingId)
        : [...state.savedListings, listingId]
      localStorage.setItem('mokogo-saved-listings', JSON.stringify(newSavedListings))
      return { savedListings: newSavedListings }
    }),
  isListingSaved: (listingId) => {
    const state = get()
    return state.savedListings.includes(listingId)
  },
}))

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('mokogo-user')
  const savedListing = localStorage.getItem('mokogo-listing')
  const savedRequests = localStorage.getItem('mokogo-requests')
  const savedAllListings = localStorage.getItem('mokogo-all-listings')
  const savedListings = localStorage.getItem('mokogo-saved-listings')
  
  if (savedUser) {
    useStore.getState().setUser(JSON.parse(savedUser))
  }
  if (savedListing) {
    useStore.getState().setCurrentListing(JSON.parse(savedListing))
  }
  if (savedRequests) {
    useStore.getState().setRequests(JSON.parse(savedRequests))
  }
  if (savedAllListings) {
    useStore.getState().setAllListings(JSON.parse(savedAllListings))
  }
  if (savedListings) {
    useStore.setState({ savedListings: JSON.parse(savedListings) })
  }
}
