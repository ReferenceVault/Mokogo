import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import { MoveInDateField } from '@/components/MoveInDateField'
import { formatPrice, formatDate } from '@/utils/formatters'
import { listingsApi, requestsApi, usersApi, messagesApi } from '@/services/api'
import UserAvatar from './UserAvatar'

import {
  MapPin,
  Shield,
  Share2,
  Heart,
  Flag,
  Images,
  Bed,
  Bath,
  Calendar,
  CheckCircle,
  MessageCircle,
  ChevronRight,
  Home,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  Wind,
  Tv,
  CookingPot,
  WashingMachine,
  Refrigerator,
  Armchair,
  Sun,
  CheckCircle2,
  Search,
  Clock
} from 'lucide-react'

interface ListingDetailContentProps {
  listingId: string
  onBack?: () => void
  onExplore?: () => void
}

const ListingDetailContent = ({ listingId, onBack, onExplore }: ListingDetailContentProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { allListings, user, currentListing, setAllListings, toggleSavedListing, isListingSaved, savedListings, setSavedListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [moveInDate, setMoveInDate] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestMessage, setRequestMessage] = useState<string | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Request status state - fetched from API
  const [requestStatus, setRequestStatus] = useState<{
    status: 'pending' | 'approved' | 'rejected' | null
    requestId?: string
  }>({ status: null })
  const [loadingRequestStatus, setLoadingRequestStatus] = useState(true)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [listingOwner, setListingOwner] = useState<any>(null)
  const contactCardRef = useRef<HTMLDivElement | null>(null)
  const contactButtonRef = useRef<HTMLButtonElement | null>(null)
  
  // Check if current user is the owner of this listing
  // If listing is in allListings, it means it's the user's own listing
  // (allListings only contains user's own listings from getAll API)
  const isOwner = !!user && allListings.some(l => l.id === listingId)
  
  // Get host information - use listing owner if available, otherwise fallback to current user
  const hostInfo = listingOwner || (user as any)
  const hostAbout =
    hostInfo?.about?.trim() ||
    `Hi! I'm ${hostInfo?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  const foundListing = allListings.find(l => l.id === listingId)

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        console.warn('ListingDetailContent: No listingId provided')
        setListing(null)
        setIsLoading(false)
        return
      }

      console.log('ListingDetailContent: Loading listing', listingId)

      // First check if it's in allListings (user's own listings)
      if (foundListing) {
        console.log('ListingDetailContent: Found in allListings')
        setListing(foundListing)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Try to get listing directly by ID (works for both logged in and not logged in)
        // The backend endpoint is public, so we can use getByIdPublic
        let response: any = null
        let errorOccurred = false
        
        try {
          // Try public endpoint first (works without auth)
          response = await listingsApi.getByIdPublic(listingId)
        } catch (publicError: any) {
          console.log('Public endpoint failed, trying authenticated endpoint...', publicError?.response?.status)
          // If public fails and user is logged in, try authenticated endpoint
          if (user) {
            try {
              response = await listingsApi.getById(listingId)
            } catch (authError: any) {
              console.error('Both public and authenticated endpoints failed:', {
                publicError: publicError?.response?.status,
                authError: authError?.response?.status,
                message: authError?.message
              })
              errorOccurred = true
            }
          } else {
            console.error('Public endpoint failed and user is not logged in:', publicError?.response?.status)
            errorOccurred = true
          }
        }

        if (response && !errorOccurred) {
          const mappedListing: Listing = {
            id: response._id || response.id,
            title: response.title,
            city: response.city || '',
            locality: response.locality || '',
            societyName: response.societyName,
            bhkType: response.bhkType || '',
            roomType: response.roomType || '',
            rent: response.rent || 0,
            deposit: response.deposit || 0,
            moveInDate: response.moveInDate || '',
            furnishingLevel: response.furnishingLevel || '',
            bathroomType: response.bathroomType,
            flatAmenities: response.flatAmenities || [],
            societyAmenities: response.societyAmenities || [],
            preferredGender: response.preferredGender || '',
            description: response.description,
            photos: response.photos || [],
            status: response.status,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
            mikoTags: response.mikoTags,
          }
          setListing(mappedListing)
          
          // Fetch owner profile if we have ownerId and it's not the current user
          const ownerId = response.ownerId
          if (ownerId && (!user || ownerId !== user.id)) {
            try {
              const ownerProfile = await usersApi.getUserById(ownerId)
              setListingOwner(ownerProfile)
            } catch (error) {
              console.error('Error fetching listing owner profile:', error)
              // If fetch fails, owner might not exist or we don't have permission
              setListingOwner(null)
            }
          } else if (ownerId && user && ownerId === user.id) {
            // If owner is current user, use current user's profile
            setListingOwner(user as any)
          }
          
          setIsLoading(false)
          return
        }

        try {
          const publicListings = await listingsApi.getAllPublic('live')
          const found = publicListings.find(l => (l._id || l.id) === listingId)
          if (found) {
            const mappedListing: Listing = {
              id: found._id || found.id,
              title: found.title,
              city: found.city || '',
              locality: found.locality || '',
              societyName: found.societyName,
              bhkType: found.bhkType || '',
              roomType: found.roomType || '',
              rent: found.rent || 0,
              deposit: found.deposit || 0,
              moveInDate: found.moveInDate || '',
              furnishingLevel: found.furnishingLevel || '',
              bathroomType: found.bathroomType,
              flatAmenities: found.flatAmenities || [],
              societyAmenities: found.societyAmenities || [],
              preferredGender: found.preferredGender || '',
              description: found.description,
              photos: found.photos || [],
              status: found.status,
              createdAt: found.createdAt,
              updatedAt: found.updatedAt,
              mikoTags: found.mikoTags,
            }
            setListing(mappedListing)

            const ownerId = (found as any).ownerId
            if (ownerId && (!user || ownerId !== user.id)) {
              try {
                const ownerProfile = await usersApi.getUserById(ownerId)
                setListingOwner(ownerProfile)
              } catch (error) {
                console.error('Error fetching listing owner profile:', error)
                setListingOwner(null)
              }
            } else if (ownerId && user && ownerId === user.id) {
              setListingOwner(user as any)
            }

            setIsLoading(false)
            return
          }
        } catch (fallbackError) {
          console.error('Error fetching listing from public listings:', fallbackError)
        }

        // If we get here, listing was not found
        console.warn('Listing not found:', listingId)
        setListing(null)
      } catch (error: any) {
        console.error('Unexpected error loading listing detail:', error)
        setListing(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadListing()
  }, [listingId, foundListing, user])

  useEffect(() => {
    if (listingId) {
      setIsSaved(isListingSaved(listingId))
    }
  }, [listingId, savedListings, isListingSaved])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('focus') === 'contact') {
      setTimeout(() => {
        contactCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        contactButtonRef.current?.focus()
      }, 100)
    }
  }, [location.search, listing?.id])

  // Check if conversation exists for this listing (only if request is approved)
  // Use a ref to prevent duplicate calls and cache results
  const conversationCheckRef = useRef<{ key: string; timestamp: number } | null>(null)
  const CONVERSATION_CACHE_TTL = 30000 // 30 seconds cache

  // Fetch request status on mount and when listingId/user changes (only for logged in users)
  useEffect(() => {
    const fetchRequestStatus = async () => {
      if (!user || !listingId) {
        setRequestStatus({ status: null })
        setLoadingRequestStatus(false)
        return
      }

      setLoadingRequestStatus(true)
      try {
        const request = await requestsApi.getStatusByListing(listingId)
        if (request) {
          const status = request.status === 'approved' 
            ? 'approved' 
            : request.status === 'rejected'
            ? 'rejected'
            : 'pending'
          setRequestStatus({
            status,
            requestId: request._id || request.id
          })
        } else {
          setRequestStatus({ status: null })
        }
      } catch (error) {
        // Silently fail - user might not have made a request yet
        setRequestStatus({ status: null })
      } finally {
        setLoadingRequestStatus(false)
      }
    }

    fetchRequestStatus()
  }, [user, listingId])
  
  useEffect(() => {
    const checkConversation = async () => {
      if (!user || !listingId || requestStatus.status !== 'approved') {
        setConversationId(null)
        return
      }

      // Check cache - prevent duplicate calls within TTL
      const cacheKey = `${listingId}-${requestStatus.status}`
      const now = Date.now()
      if (conversationCheckRef.current?.key === cacheKey && 
          (now - conversationCheckRef.current.timestamp) < CONVERSATION_CACHE_TTL) {
        return
      }

      conversationCheckRef.current = { key: cacheKey, timestamp: now }

      try {
        const conversations = await messagesApi.getAllConversations()
        const conversation = conversations.find(conv => {
          const convListingId = typeof conv.listingId === 'object' 
            ? (conv.listingId as any)._id || (conv.listingId as any).id 
            : conv.listingId
          return convListingId === listingId
        })
        setConversationId(conversation ? (conversation._id || conversation.id) : null)
      } catch (error: any) {
        // Handle 429 (Too Many Requests) gracefully - don't retry immediately
        if (error.response?.status === 429) {
          console.warn('Rate limited on conversation check, will retry later')
          // Keep existing conversationId or null, don't update
          // Extend cache to prevent immediate retry
          if (conversationCheckRef.current) {
            conversationCheckRef.current.timestamp = now + 60000 // Extend by 1 minute
          }
        } else {
          console.error('Error checking conversation:', error)
          setConversationId(null)
        }
      }
    }

    // Only check if status is approved, with debounce
    if (requestStatus.status === 'approved') {
      const timeoutId = setTimeout(() => {
        checkConversation()
      }, 500) // Increased debounce to 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setConversationId(null)
    }
  }, [user, listingId, requestStatus.status])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-600">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h1>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or is no longer available.</p>
          {onBack && (
            <button onClick={onBack} className="text-orange-400 hover:text-orange-500">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    )
  }

  // Handle navigation to messages
  // If request is approved, conversation should exist (created by backend)
  // Navigate to messages - user can find the conversation there
  const handleStartConversation = () => {
    // If we have conversationId, navigate directly to it
    if (conversationId) {
      navigate(`/dashboard?view=messages&conversation=${conversationId}`)
    } else if (requestStatus.status === 'approved') {
      // Request is approved, conversation should exist - navigate to messages
      // MessagesContent will load conversations and user can find theirs
      navigate('/dashboard?view=messages')
    } else {
      // Fallback
      navigate('/dashboard?view=messages')
    }
  }

  // Handle sending request after rejection
  const handleSendRequestAgain = () => {
    // Reset request status to allow new request
    setRequestStatus({ status: null })
    // Reset form
    setMessage('')
    setMoveInDate('')
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = () => {
    if (!listingId) return
    const willSave = !isListingSaved(listingId)
    const request = willSave
      ? usersApi.saveListing(listingId)
      : usersApi.removeSavedListing(listingId)
    request
      .then((updated) => {
        setSavedListings(updated)
        setIsSaved(updated.includes(listingId))
      })
      .catch(() => {
        toggleSavedListing(listingId)
        setIsSaved(!isSaved)
      })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      }).catch(() => {
        // User cancelled or error occurred
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handlePhotoNav = (direction: 'prev' | 'next') => {
    if (!listing?.photos || listing.photos.length === 0) return
    setActivePhotoIndex((prev) => {
      const lastIndex = listing.photos.length - 1
      if (direction === 'prev') {
        return prev === 0 ? lastIndex : prev - 1
      }
      return prev === lastIndex ? 0 : prev + 1
    })
  }

  const handleContactHost = async () => {
    if (!user || !listing) return
    
    setIsSubmitting(true)
    setRequestMessage(null)
    try {
      const newRequest = await requestsApi.create({
        listingId: listing.id,
        message: message || undefined,
        moveInDate: moveInDate || undefined,
      })
      
      // Update request status
      setRequestStatus({
        status: 'pending',
        requestId: newRequest._id || newRequest.id
      })
      
      // Show success message inline
      setRequestMessage('Request sent successfully! The host will review your request.')
      
      // Clear form
      setMessage('')
      setMoveInDate('')
      
      // Navigate to requests in dashboard
      if (onBack) {
        onBack()
      }
  } catch (error: any) {
    console.error('Error sending request:', error)
    const errorMessage = error.response?.data?.message || 'Failed to send request. Please try again.'
    setRequestMessage(errorMessage)
    
    // If error is about existing request, refresh status
    if (errorMessage.includes('already') || errorMessage.includes('pending') || errorMessage.includes('approved')) {
      // Refetch request status
      try {
        const request = await requestsApi.getStatusByListing(listing.id)
        if (request) {
          const status = request.status === 'approved' 
            ? 'approved' 
            : request.status === 'rejected'
            ? 'rejected'
            : 'pending'
          setRequestStatus({
            status,
            requestId: request._id || request.id
          })
        }
      } catch (refreshError) {
        console.error('Error refreshing request status:', refreshError)
      }
    }
  } finally {
    setIsSubmitting(false)
  }
}

  const handleMarkAsFulfilled = () => {
    if (listing) {
      const updatedListing = { ...listing, status: 'fulfilled' as const, updatedAt: new Date().toISOString() }
      const updatedListings = allListings.map(l => l.id === listing.id ? updatedListing : l)
      setAllListings(updatedListings)
      // Also update currentListing if it matches
      if (currentListing?.id === listing.id) {
        // We'd need setCurrentListing here, but it's not in the destructured values
        // The listing will be updated in allListings which should be sufficient
      }
    }
  }


  const similarListings = allListings
    .filter(l => l.id !== listingId && l.city === listing.city)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              {onBack ? (
                <button onClick={onBack} className="text-orange-400 hover:text-orange-500">Dashboard</button>
              ) : (
                <Link to="/dashboard" className="text-orange-400 hover:text-orange-500">Dashboard</Link>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-orange-400">{listing.city}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{listing.title}</span>
            </nav>
            <button
              onClick={() => {
                if (onExplore) {
                  onExplore()
                } else if (onBack) {
                  onBack()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all duration-300 border border-orange-200 hover:border-orange-300"
            >
              <Search className="w-4 h-4" />
              Browse More Properties
            </button>
          </div>
        </div>
      </section>

      {/* Listing Header Section */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-4 flex-wrap gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{listing.title}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-orange-400 mr-2" />
                  <span>{listing.locality}, {listing.city}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 flex-wrap">
                {listing.preferredGender && (
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.preferredGender === 'Male' ? 'Male Preferred' : listing.preferredGender === 'Female' ? 'Female Preferred' : 'Any Gender'}
                  </span>
                )}
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Available {formatDate(listing.moveInDate)}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {listing.furnishingLevel}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              {isOwner && listing.status === 'live' && (
                <button
                  onClick={handleMarkAsFulfilled}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Fulfilled</span>
                </button>
              )}
              {listing.status === 'fulfilled' && (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Fulfilled - Off Market</span>
                </span>
              )}
              {!isOwner && (
                <>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-600" />
                    <span>Share</span>
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 rounded-xl overflow-hidden">
            <div className="relative">
              {listing.photos && listing.photos.length > 0 ? (
                <img 
                  className="w-full h-[300px] lg:h-[350px] object-cover" 
                  src={listing.photos[activePhotoIndex]} 
                  alt={`${listing.title} photo ${activePhotoIndex + 1}`} 
                />
              ) : (
                <div className="w-full h-[300px] lg:h-[350px] bg-gray-200 flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {listing.photos && listing.photos.length > 1 && (
                <>
                  <button
                    onClick={() => handlePhotoNav('prev')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    type="button"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handlePhotoNav('next')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    type="button"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {listing.photos?.slice(1, 5).map((photo, idx) => (
                <div key={idx} className="relative">
                  <img 
                    className="w-full h-[90px] lg:h-[110px] object-cover rounded-lg" 
                    src={photo} 
                    alt={`${listing.title} ${idx + 2}`} 
                  />
                  {idx === 3 && listing.photos && listing.photos.length > 5 && (
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold rounded-lg hover:bg-black/50 transition-colors">
                      <Images className="w-3.5 h-3.5 mr-1.5" />
                      View All {listing.photos.length} Photos
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 gap-6 ${!isOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            
            {/* Left Content */}
            <div className={`space-y-4 ${!isOwner ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              
              {/* Room Details */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Room Details</h2>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">₹{formatPrice(listing.rent)}</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <Bed className="w-6 h-6 text-orange-400 mx-auto mb-1.5" />
                    <div className="text-sm font-semibold text-gray-900">{listing.bhkType}</div>
                    <div className="text-xs text-gray-600">{listing.roomType}</div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <Bath className="w-6 h-6 text-orange-400 mx-auto mb-1.5" />
                    <div className="text-sm font-semibold text-gray-900">1 Bathroom</div>
                    <div className="text-xs text-gray-600">Dedicated</div>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-orange-400 mx-auto mb-1.5" />
                    <div className="text-sm font-semibold text-gray-900">Available</div>
                    <div className="text-xs text-gray-600">{formatDate(listing.moveInDate)}</div>
                  </div>
                </div>
                
                <div className="border-t border-stone-200 pt-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {listing.description || 'Welcome to this beautiful, spacious room in a premium apartment. Perfect for working professionals, this fully furnished room offers a comfortable living experience with modern amenities and excellent connectivity.'}
                  </p>
                </div>
              </div>
              
              {/* Amenities Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Amenities & Features</h2>
                
                {/* Amenity Icon Mapping */}
                {(() => {
                  const amenityIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                    'WiFi': Wifi,
                    'AC': Wind,
                    'TV': Tv,
                    'Parking': Car,
                    'Gym': Dumbbell,
                    'Pool': Waves,
                    'Security': Shield,
                    'Kitchen': CookingPot,
                    'Washing machine': WashingMachine,
                    'Fridge': Refrigerator,
                    'Sofa': Armchair,
                    'Bed': Bed,
                    'Geyser': Bath,
                    'Balcony': Sun
                  }

                  const allAmenities = [...(listing.flatAmenities || []), ...(listing.societyAmenities || [])]

                  return (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allAmenities.map((amenity, idx) => {
                        const Icon = amenityIconMap[amenity] || CheckCircle
                        return (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg hover:border-orange-300 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-orange-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
              
              {/* Host Information Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Meet Your Host</h2>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <UserAvatar 
                      user={{ 
                        name: hostInfo?.name, 
                        profileImageUrl: hostInfo?.profileImageUrl 
                      }}
                      size="xl"
                      showBorder={true}
                      className="bg-orange-400 border-orange-400/20"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{hostInfo?.name || 'Host'}</h3>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {hostAbout}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Languages:</span> Hindi, English
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">Response time:</span> Within 2 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Right Sidebar - Only show for non-owners */}
            {!isOwner && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                
                {/* Contact Card */}
                <div ref={contactCardRef} className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4">
                  {listing.status === 'fulfilled' ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">This Property is Fulfilled</h3>
                      <p className="text-sm text-gray-600">This listing is no longer available on the market.</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-xl font-bold text-gray-900 mb-1">₹{formatPrice(listing.rent)}</div>
                        <div className="text-sm text-gray-600">per month</div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="border border-stone-300 rounded-lg p-2">
                          <div className="text-xs font-semibold text-gray-700 uppercase mb-1">Move-in Date</div>
                          <div className="[&_button]:!h-auto [&_button]:!py-0 [&_button]:!px-0 [&_button]:!border-0 [&_button]:!bg-transparent [&_button]:!shadow-none [&_button]:!min-w-0 [&_button]:!w-full [&_button]:text-xs">
                            <MoveInDateField
                              value={moveInDate}
                              onChange={(date) => setMoveInDate(date)}
                              min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                              hideLabel={true}
                              numberOfMonths={1}
                            />
                          </div>
                        </div>
                        
                        <div className="border border-stone-300 rounded-lg p-2">
                          <div className="text-xs font-semibold text-gray-700 uppercase mb-1.5">Your Message (Optional)</div>
                          <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border-0 p-0 text-xs focus:ring-0 resize-none bg-transparent" 
                            rows={3} 
                            placeholder="Tell the host about yourself..."
                          />
                        </div>
                      </div>
                      
                      {/* Contact Host Button - Single button that changes based on request status */}
                      {loadingRequestStatus ? (
                        <button 
                          disabled
                          className="w-full bg-gray-200 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed mb-3 text-sm"
                        >
                          <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                          Loading...
                        </button>
                      ) : requestStatus.status === 'pending' ? (
                        <button 
                          disabled
                          className="w-full bg-gray-300 text-gray-600 font-semibold py-2.5 rounded-lg cursor-not-allowed mb-3 text-sm"
                        >
                          <Clock className="w-4 h-4 inline mr-2" />
                          Request Sent
                        </button>
                      ) : requestStatus.status === 'approved' ? (
                        <button 
                          onClick={handleStartConversation}
                          className="w-full bg-green-500 text-white font-semibold py-2.5 rounded-lg hover:bg-green-600 hover:shadow-lg transition-all transform hover:scale-105 mb-3 text-sm"
                        >
                          <MessageCircle className="w-4 h-4 inline mr-2" />
                          Start Conversation
                        </button>
                      ) : requestStatus.status === 'rejected' ? (
                        <button 
                          onClick={handleSendRequestAgain}
                          className="w-full bg-orange-400 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-3 text-sm"
                        >
                          <MessageCircle className="w-4 h-4 inline mr-2" />
                          Send Request Again
                        </button>
                      ) : (
                        <>
                          <button 
                            ref={contactButtonRef}
                            onClick={handleContactHost}
                            disabled={isSubmitting || listing.status === ('fulfilled' as Listing['status'])}
                            className="w-full bg-orange-400 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                Contact Host
                              </>
                            )}
                          </button>
                          
                          {requestMessage && (
                            <div
                              className={`mb-3 rounded-lg px-3 py-2 text-xs font-medium ${
                                requestMessage.toLowerCase().includes('failed')
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-green-50 text-green-700 border border-green-200'
                              }`}
                            >
                              {requestMessage}
                            </div>
                          )}

                          <div className="text-center text-xs text-gray-600 mb-3">
                            You won't be charged yet
                          </div>
                        </>
                      )}
                  </>
                  )}
                  
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700">Monthly rent</span>
                      <span className="text-xs text-gray-900">₹{formatPrice(listing.rent)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700">Security deposit</span>
                      <span className="text-xs text-gray-900">₹{formatPrice(listing.deposit)}</span>
                    </div>
                    <div className="border-t border-stone-200 pt-1.5 mt-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-sm text-gray-900">Total upfront</span>
                        <span className="text-sm text-gray-900">₹{formatPrice(listing.rent + listing.deposit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Safety Tips */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-orange-400 mr-2" />
                    <h3 className="text-base font-semibold text-gray-900">Safety First</h3>
                  </div>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Always meet in person before committing</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Verify host identity and documents</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Never transfer money without visiting</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                      <span>Use MOKOGO messaging for initial contact</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            )}
            
          </div>
        </div>
      </section>

      {/* Similar Listings Section */}
      {similarListings.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Similar Rooms in {listing.city}</h2>
              <Link to="/explore" className="text-sm text-orange-400 hover:text-orange-500 font-semibold">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarListings.map((similar) => (
                <Link 
                  key={similar.id}
                  to={`/dashboard?listing=${similar.id}`}
                  className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-white/35"
                >
                  <div className="relative">
                    {similar.photos && similar.photos.length > 0 ? (
                      <img 
                        className="w-full h-36 object-cover rounded-t-xl" 
                        src={similar.photos[0]} 
                        alt={similar.title} 
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-200 rounded-t-xl flex items-center justify-center">
                        <Home className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        const willSave = !isListingSaved(similar.id)
                        const request = willSave
                          ? usersApi.saveListing(similar.id)
                          : usersApi.removeSavedListing(similar.id)
                        request
                          .then((updated) => {
                            setSavedListings(updated)
                          })
                          .catch(() => {
                            toggleSavedListing(similar.id)
                          })
                      }}
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isListingSaved(similar.id) ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{similar.title}</h3>
                      <div className="text-right">
                        <div className="text-base font-bold text-gray-900">₹{formatPrice(similar.rent)}</div>
                        <div className="text-xs text-gray-500">/month</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                      <span className="text-xs">{similar.locality}, {similar.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-medium">
                        {similar.preferredGender || 'Any'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

export default ListingDetailContent

