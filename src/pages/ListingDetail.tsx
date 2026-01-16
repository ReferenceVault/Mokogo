import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Logo from '@/components/Logo'
import UserAvatar from '@/components/UserAvatar'
import { useStore } from '@/store/useStore'

import { formatPrice, formatDate } from '@/utils/formatters'
import { handleLogout as handleLogoutUtil } from '@/utils/auth'
import { requestsApi, listingsApi, messagesApi, usersApi, UserProfile } from '@/services/api'
import { Listing } from '@/types'

import {
  MapPin,
  Shield,
  Share2,
  Heart,
  Flag,
  Images,
  Bed,
  Bath,
  Square,
  Calendar,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Home,
  Clock,
  Search,
  Bell,
  Heart as HeartIcon
} from 'lucide-react'

const ListingDetail = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { allListings, user, setUser, toggleSavedListing, isListingSaved, savedListings, setSavedListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isListingLoading, setIsListingLoading] = useState(true)
  const [listingOwner, setListingOwner] = useState<UserProfile | null>(null)

  // Keep listing detail public regardless of auth state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Don't auto-redirect - let users access /listings/:id directly
  // If they want dashboard view, they can navigate there manually

  // Fetch listing - try public listings first (works for both logged in and not logged in)
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setLoading(false)
        setIsListingLoading(false)
        return
      }

      // First check if it's in allListings (user's own listings)
      const foundInStore = allListings.find(l => l.id === listingId)
      if (foundInStore) {
        setListing(foundInStore)
        setLoading(false)
        setIsListingLoading(false)
        
        // Try to get ownerId from API for ownership check and fetch owner profile
        try {
          const listingDetail = user
            ? await listingsApi.getById(listingId).catch(() => null)
            : await listingsApi.getByIdPublic(listingId).catch(() => null)
          if (listingDetail) {
            const ownerId = listingDetail.ownerId
            setListingOwnerId(ownerId)
            // Fetch owner profile
            if (ownerId && user && ownerId !== user.id) {
              try {
                const ownerProfile = await usersApi.getUserById(ownerId)
                setListingOwner(ownerProfile)
              } catch (error) {
                console.error('Error fetching listing owner profile:', error)
              }
            } else if (ownerId && user && ownerId === user.id) {
              setListingOwner(user as any)
            }
          } else {
            // Fallback to public listings
            try {
              const publicListings = await listingsApi.getAllPublic('live')
              const found = publicListings.find(l => (l._id || l.id) === listingId)
              if (found) {
                const ownerId = (found as any).ownerId || null
                setListingOwnerId(ownerId)
                // Fetch owner profile if we have ownerId
                if (ownerId && user && ownerId !== user.id) {
                  try {
                    const ownerProfile = await usersApi.getUserById(ownerId)
                    setListingOwner(ownerProfile)
                  } catch (error) {
                    console.error('Error fetching listing owner profile:', error)
                  }
                } else if (ownerId && user && ownerId === user.id) {
                  setListingOwner(user as any)
                }
              }
            } catch (publicError) {
              console.error('Error fetching public listing:', publicError)
            }
          }
        } catch (error) {
          // If getById fails, try public listings
          try {
            const publicListings = await listingsApi.getAllPublic('live')
            const found = publicListings.find(l => (l._id || l.id) === listingId)
            if (found) {
              const ownerId = (found as any).ownerId || null
              setListingOwnerId(ownerId)
              // Fetch owner profile if we have ownerId
              if (ownerId && user && ownerId !== user.id) {
                try {
                  const ownerProfile = await usersApi.getUserById(ownerId)
                  setListingOwner(ownerProfile)
                } catch (error) {
                  console.error('Error fetching listing owner profile:', error)
                }
              } else if (ownerId && user && ownerId === user.id) {
                setListingOwner(user as any)
              }
            }
          } catch (publicError) {
            console.error('Error fetching public listing:', publicError)
          }
        }
        return
      }

      // Try to get listing directly by ID (works for both logged in and not logged in)
      try {
        setLoading(true)
        setIsListingLoading(true)
        
        let response: any
        try {
          // Try public endpoint first (works without auth)
          response = await listingsApi.getByIdPublic(listingId)
        } catch (publicError: any) {
          // If public fails and user is logged in, try authenticated endpoint
          if (user) {
            try {
              response = await listingsApi.getById(listingId)
            } catch (authError) {
              console.error('Error fetching listing:', authError)
              throw publicError // Use the original error
            }
          } else {
            throw publicError
          }
        }

        if (response) {
          // Map API response to frontend format
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
          // Store ownerId to check ownership
          const ownerId = response.ownerId || null
          setListingOwnerId(ownerId)
          
          // Fetch owner profile if we have ownerId and it's not the current user
          if (ownerId && user && ownerId !== user.id) {
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
        } else {
          setListing(null)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
        setListing(null)
      } finally {
        setLoading(false)
        setIsListingLoading(false)
      }
    }

    fetchListing()
  }, [listingId, allListings, user])

  // Check if listing is saved when component loads, listingId changes, or savedListings changes
  useEffect(() => {
    if (listingId && user) {
      setIsSaved(isListingSaved(listingId))
    } else {
      setIsSaved(false)
    }
  }, [listingId, user, savedListings, isListingSaved])

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [moveInDate, setMoveInDate] = useState('')
  const [duration, setDuration] = useState('6 months')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [listingOwnerId, setListingOwnerId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Fetch user profile if profileImageUrl is missing
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return
      
      // Only fetch if profileImageUrl is missing
      if ((user as any).profileImageUrl) return
      
      try {
        const profile = await usersApi.getMyProfile()
        // Merge profile data with existing user data
        const updatedUser = { ...user, ...profile }
        setUser(updatedUser as any)
      } catch (error) {
        console.error('Error fetching user profile in ListingDetail:', error)
      }
    }
    
    fetchProfile()
  }, [user, setUser])

  // Request status state - fetched from API
  const [requestStatus, setRequestStatus] = useState<{
    status: 'pending' | 'approved' | 'rejected' | null
    requestId?: string
  }>({ status: null })
  const [loadingRequestStatus, setLoadingRequestStatus] = useState(true)

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        setListing(null)
        setIsListingLoading(false)
        setLoading(false)
        return
      }

      const cachedListing = allListings.find(l => l.id === listingId)
      if (cachedListing) {
        setListing(cachedListing)
        setIsListingLoading(false)
        setLoading(false)
        return
      }

      setIsListingLoading(true)
      setLoading(true)
      try {
        const response = await listingsApi.getById(listingId)
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
      } catch (error) {
        console.error('Error loading listing detail:', error)
        setListing(null)
      } finally {
        setIsListingLoading(false)
      }
    }

    loadListing()
  }, [listingId, allListings])

  // Check if current user is the owner of this listing
  // Only check ownerId from API response, not allListings (which may contain public listings)
  const isOwner = !!user && !!listingOwnerId && (
    listingOwnerId === user.id || listingOwnerId === (user as any)._id
  )

  // Get host information - use listing owner if available, otherwise fallback to current user
  const hostInfo = listingOwner || (user as any)
  const hostAbout =
    hostInfo?.about?.trim() ||
    `Hi! I'm ${hostInfo?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  // Fetch request status on mount and when listingId/user changes
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
        console.error('Error fetching request status:', error)
        setRequestStatus({ status: null })
      } finally {
        setLoadingRequestStatus(false)
      }
    }

    fetchRequestStatus()
  }, [user, listingId])

  // Check if conversation exists for this listing (only if request is approved)
  // Use a ref to prevent duplicate calls and cache results
  const conversationCheckRef = useRef<{ key: string; timestamp: number } | null>(null)
  const CONVERSATION_CACHE_TTL = 30000 // 30 seconds cache
  
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
  const handleSendRequestAgain = async () => {
    // Reset request status to allow new request
    setRequestStatus({ status: null })
    // Reset form
    setMessage('')
    setMoveInDate('')
    setDuration('6 months')
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading listing...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isListingLoading) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header forceGuest />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-600">Loading listing...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-mokogo-off-white flex flex-col">
        <Header forceGuest />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h1>
            <Link to="/" className="text-orange-400 hover:text-orange-500">
              Back to listings
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleSave = () => {
    // Check if user is logged in
    if (!user) {
      if (listingId) {
        localStorage.setItem('mokogo-pending-saved-listing', listingId)
      }
      sessionStorage.setItem(
        'mokogo-auth-redirect',
        JSON.stringify({ path: '/dashboard', view: 'saved' })
      )
      navigate('/auth?redirect=/dashboard&view=saved')
      return
    }

    // User is logged in - toggle save
    if (listingId) {
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
          // Fallback to local toggle if API fails
          toggleSavedListing(listingId)
          setIsSaved(!isSaved)
        })
    }
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const handleReport = () => {
    // Check if user is logged in
    if (!user) {
      navigate(`/auth?redirect=/listings/${listingId}`)
      return
    }

    // User is logged in - implement report functionality
    // You can add a report modal or navigate to report page
    alert('Report functionality will be implemented')
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
  // Check if user is logged in
  if (!user) {
    if (listingId) {
      sessionStorage.setItem(
        'mokogo-auth-redirect',
        JSON.stringify({ path: '/dashboard', listingId, focus: 'contact' })
      )
    }
    navigate(`/auth?redirect=/dashboard&listing=${listingId}&focus=contact`)
    return
  }

  if (!listing) return

    setIsSubmitting(true)
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

      // Clear form
      setMessage('')
      setMoveInDate('')
      setDuration('6 months')

      // Show success message
      alert('Request sent successfully! The host will review your request.')
  } catch (error: any) {
    console.error('Error sending request:', error)
    const errorMessage = error.response?.data?.message || 'Failed to send request. Please try again.'
    alert(errorMessage)
    
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

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }


  // Mock similar listings (filter current listing)
  const similarListings = allListings
    .filter(l => l.id !== listingId && l.city === listing.city)
    .slice(0, 3)

  const faqs = [
    {
      id: '1',
      question: 'What is included in the rent?',
      answer: 'The rent includes furnished room, Wi-Fi, and access to common areas (kitchen, living room). Electricity charges are shared equally among flatmates. Maintenance fee of ₹500/month covers society charges and basic repairs.'
    },
    {
      id: '2',
      question: 'What is the security deposit policy?',
      answer: 'Security deposit is 2 months\' rent (₹' + formatPrice(listing.deposit) + '). It will be refunded within 15 days of checkout after deducting any damages or pending dues. The deposit is refundable and serves as security for the property.'
    },
    {
      id: '3',
      question: 'Can I schedule a visit before deciding?',
      answer: 'Absolutely! We encourage all potential tenants to visit the property in person. You can schedule a visit through our platform or contact the host directly. Virtual tours are also available if you\'re unable to visit immediately.'
    },
    {
      id: '4',
      question: 'What is the minimum stay duration?',
      answer: 'The minimum stay duration is 6 months. However, we prefer long-term tenants (12+ months) for stability. If you need to leave early, a 1-month notice period is required as per the rental agreement.'
    },
    {
      id: '5',
      question: 'Are there any additional charges?',
      answer: 'Apart from rent and maintenance (₹500/month), you\'ll need to contribute to electricity bills based on actual consumption. Cooking gas is shared among flatmates. No other hidden charges.'
    }
  ]

  const handleLogout = () => handleLogoutUtil(navigate)

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {user ? (
        <>
          {/* Lister Dashboard Header */}
          <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <Logo />
                  
                  <nav className="hidden md:flex items-center space-x-1">
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    >
                      My Listings
                    </Link>
                  </nav>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="hidden lg:flex items-center bg-white/85 backdrop-blur-md rounded-xl px-4 py-2 border border-stone-200">
                    <Search className="w-4 h-4 text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      placeholder="Search listings, areas..." 
                      className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-64" 
                    />
                  </div>
                  
                  <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
                  </button>
                  
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <HeartIcon className="w-5 h-5" />
                  </button>
                  
                  <div 
                    className="flex items-center gap-3 cursor-pointer relative"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <UserAvatar 
                        user={{
                          name: user?.name,
                          profileImageUrl: (user as any)?.profileImageUrl
                        }}
                        size="md"
                        showBorder={false}
                        className="shadow-lg bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                      />
                    </div>
                  </div>

                  {showUserMenu && (
                    <div className="absolute top-full right-4 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-orange-200/50 py-2 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-orange-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
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
                          handleLogout()
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Click outside to close user menu */}
          {showUserMenu && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowUserMenu(false)}
            />
          )}
        </>
      ) : (
        <Header forceGuest />
      )}

      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-orange-400 hover:text-orange-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/explore" className="text-orange-400 hover:text-orange-500">Find Rooms</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-orange-400">{listing.city}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{listing.title}</span>
          </nav>
        </div>
      </section>

      {/* Listing Header Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4 flex-wrap gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{listing.title}</h1>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Verified</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-orange-400 mr-2" />
                  <span>{listing.locality}, {listing.city}</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span>ID Verified Host</span>
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
              <button 
                onClick={handleReport}
                disabled={!user}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            <div className="relative">
              {listing.photos && listing.photos.length > 0 ? (
                <img 
                  className="w-full h-[400px] lg:h-[500px] object-cover" 
                  src={listing.photos[activePhotoIndex]} 
                  alt={`${listing.title} photo ${activePhotoIndex + 1}`} 
                />
              ) : (
                <div className="w-full h-[400px] lg:h-[500px] bg-gray-200 flex items-center justify-center">
                  <Home className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {listing.photos && listing.photos.length > 1 && (
                <>
                  <button
                    onClick={() => handlePhotoNav('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    type="button"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handlePhotoNav('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                    type="button"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {listing.photos?.slice(1, 5).map((photo, idx) => (
                <div key={idx} className="relative">
                  <img 
                    className="w-full h-[120px] lg:h-[160px] object-cover rounded-lg" 
                    src={photo} 
                    alt={`${listing.title} ${idx + 2}`} 
                  />
                  {idx === 3 && listing.photos && listing.photos.length > 5 && (
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold rounded-lg hover:bg-black/50 transition-colors">
                      <Images className="w-4 h-4 mr-2" />
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
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 gap-12 ${!isOwner ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
            
            {/* Left Content */}
            <div className={`space-y-8 ${!isOwner ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              
              {/* Room Details */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">₹{formatPrice(listing.rent)}</div>
                    <div className="text-gray-600">per month</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-stone-50 rounded-xl">
                    <Bed className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">{listing.bhkType}</div>
                    <div className="text-sm text-gray-600">{listing.roomType}</div>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-xl">
                    <Bath className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">1 Bathroom</div>
                    <div className="text-sm text-gray-600">Dedicated</div>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-xl">
                    <Square className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">200 sq ft</div>
                    <div className="text-sm text-gray-600">Room Size</div>
                  </div>
                  <div className="text-center p-4 bg-stone-50 rounded-xl">
                    <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-semibold text-gray-900">Available</div>
                    <div className="text-sm text-gray-600">{formatDate(listing.moveInDate)}</div>
                  </div>
                </div>
                
                <div className="border-t border-stone-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {listing.description || 'Welcome to this beautiful, spacious room in a premium apartment. Perfect for working professionals, this fully furnished room offers a comfortable living experience with modern amenities and excellent connectivity.'}
                  </p>
                </div>
              </div>
              
              {/* Amenities Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Amenities</h3>
                    <div className="space-y-3">
                      {listing.flatAmenities.slice(0, 6).map((amenity, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Areas</h3>
                    <div className="space-y-3">
                      {listing.societyAmenities.slice(0, 6).map((amenity, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Host Information Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Your Host</h2>
                
                <div className="flex items-start space-x-6">
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
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{hostInfo?.name || 'Host'}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Verified Host</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Superhost</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-orange-400 mr-1" />
                        <span>12 reviews</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-orange-400 mr-1" />
                        <span>Hosting since 2022</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">
                      {hostAbout}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Languages:</span> Hindi, English
                      </div>
                      <div className="text-sm text-gray-600">
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
              <div className="sticky top-24 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/35 p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-1">₹{formatPrice(listing.rent)}</div>
                    <div className="text-gray-600">per month</div>
                    <div className="text-sm text-gray-500 mt-1">+ ₹500 maintenance</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-stone-300 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-700 uppercase mb-1">Move-in Date</div>
                        <input 
                          type="date" 
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className="w-full border-0 p-0 text-sm focus:ring-0 bg-transparent" 
                        />
                      </div>
                      <div className="border border-stone-300 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-700 uppercase mb-1">Duration</div>
                        <select 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full border-0 p-0 text-sm focus:ring-0 bg-transparent"
                        >
                          <option>6 months</option>
                          <option>12 months</option>
                          <option>Flexible</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="border border-stone-300 rounded-lg p-3">
                      <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Your Message (Optional)</div>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border-0 p-0 text-sm focus:ring-0 resize-none bg-transparent" 
                        rows={3} 
                        placeholder="Tell the host about yourself..."
                      />
                    </div>
                  </div>
                  
                  {/* Contact Host Button - Single button that changes based on request status */}
                  {loadingRequestStatus ? (
                    <button 
                      disabled
                      className="w-full bg-gray-200 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed mb-4"
                    >
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                      Loading...
                    </button>
                  ) : requestStatus.status === 'pending' ? (
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-600 font-bold py-4 rounded-xl cursor-not-allowed mb-4"
                    >
                      <Clock className="w-5 h-5 inline mr-2" />
                      Request Sent
                    </button>
                  ) : requestStatus.status === 'approved' ? (
                    <button 
                      onClick={handleStartConversation}
                      className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 hover:shadow-lg transition-all transform hover:scale-105 mb-4"
                    >
                      <MessageCircle className="w-5 h-5 inline mr-2" />
                      Start Conversation
                    </button>
                  ) : requestStatus.status === 'rejected' ? (
                    <button 
                      onClick={handleSendRequestAgain}
                      className="w-full bg-orange-400 text-white font-bold py-4 rounded-xl hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-4"
                    >
                      <MessageCircle className="w-5 h-5 inline mr-2" />
                      Send Request Again
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={handleContactHost}
                        disabled={isSubmitting}
                        className="w-full bg-orange-400 text-white font-bold py-4 rounded-xl hover:bg-orange-500 hover:shadow-lg transition-all transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageCircle className="w-5 h-5 inline mr-2" />
                            Contact Host
                          </>
                        )}
                      </button>
                      
                      <div className="text-center text-sm text-gray-600 mb-4">
                        You won't be charged yet
                      </div>
                    </>
                  )}
                  
                  <div className="border-t border-stone-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Monthly rent</span>
                      <span className="text-gray-900">₹{formatPrice(listing.rent)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Maintenance</span>
                      <span className="text-gray-900">₹500</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Security deposit</span>
                      <span className="text-gray-900">₹{formatPrice(listing.deposit)}</span>
                    </div>
                    <div className="border-t border-stone-200 pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-900">Total upfront</span>
                        <span className="text-gray-900">₹{formatPrice(listing.rent + 500 + listing.deposit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Safety Tips */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-orange-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Always meet in person before committing</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Verify host identity and documents</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      <span>Never transfer money without visiting</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
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
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Similar Rooms in {listing.city}</h2>
              <Link to="/" className="text-orange-400 hover:text-orange-500 font-semibold">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarListings.map((similar) => (
                <Link 
                  key={similar.id}
                  to={`/dashboard?listing=${similar.id}`}
                  className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-white/35"
                >
                  <div className="relative">
                    {similar.photos && similar.photos.length > 0 ? (
                      <img 
                        className="w-full h-48 object-cover rounded-t-2xl" 
                        src={similar.photos[0]} 
                        alt={similar.title} 
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        setIsSaved(!isSaved)
                      }}
                      className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{similar.title}</h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">₹{formatPrice(similar.rent)}</div>
                        <div className="text-sm text-gray-500">/month</div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                      <span className="text-sm">{similar.locality}, {similar.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-medium">
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get answers to common questions about this listing and the rental process</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-stone-200 rounded-xl">
                <button 
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ListingDetail

