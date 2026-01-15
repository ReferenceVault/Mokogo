import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useStore } from '@/store/useStore'

import { formatPrice, formatDate } from '@/utils/formatters'
import { requestsApi, listingsApi, usersApi } from '@/services/api'
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
  Clock
} from 'lucide-react'

const ListingDetail = () => {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { allListings, user, requests, toggleSavedListing, isListingSaved, savedListings, setSavedListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isListingLoading, setIsListingLoading] = useState(true)
  const hostAbout =
    user?.about?.trim() ||
    `Hi! I'm ${user?.name || 'a professional'} working in ${listing?.city || 'this city'}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.`

  // Keep listing detail public regardless of auth state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // If user is logged in, show the authenticated view inside dashboard
  useEffect(() => {
    if (user && listingId) {
      navigate(`/dashboard?listing=${listingId}`)
    }
  }, [user, listingId, navigate])

  // Check if listing is saved when component loads, listingId changes, or savedListings changes
  useEffect(() => {
    if (listingId && user) {
      setIsSaved(isListingSaved(listingId))
    } else {
      setIsSaved(false)
    }
  }, [listingId, user, savedListings, isListingSaved])
  // No need to redirect - this is now a protected route, user must be logged in

  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [moveInDate, setMoveInDate] = useState('')
  const [duration, setDuration] = useState('6 months')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadListing = async () => {
      if (!listingId) {
        setListing(null)
        setIsListingLoading(false)
        return
      }

      const cachedListing = allListings.find(l => l.id === listingId)
      if (cachedListing) {
        setListing(cachedListing)
        setIsListingLoading(false)
        return
      }

      setIsListingLoading(true)
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

  // Check if user has already contacted this property
  const existingRequest = listingId && user 
    ? requests.find(r => r.listingId === listingId && r.seekerId === user.id)
    : null

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
    // Redirect to login with redirect params to go to sent requests after login
    navigate(`/auth?redirect=/dashboard&view=requests&tab=sent`)
    return
  }

  if (!listing) return

  setIsSubmitting(true)
  try {
    await requestsApi.create({
      listingId: listing.id,
      message: message || undefined,
      moveInDate: moveInDate || undefined,
    })

    // Clear form
    setMessage('')
    setMoveInDate('')

    // Navigate to dashboard requests page with sent tab
    navigate('/dashboard?view=requests&tab=sent')
  } catch (error: any) {
    console.error('Error sending request:', error)
    alert(
      error.response?.data?.message ||
        'Failed to send request. Please try again.'
    )
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

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <Header forceGuest />

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
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
                    <div className="w-20 h-20 rounded-full bg-orange-400 flex items-center justify-center border-4 border-orange-400/20">
                      <span className="text-white font-semibold text-xl">
                        {user?.name?.[0]?.toUpperCase() || 'H'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{user?.name || 'Host'}</h3>
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
            
            {/* Right Sidebar */}
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
                  
                  {existingRequest ? (
                    // Show status if user has already contacted
                    <div className="w-full bg-blue-50 border border-blue-200 rounded-xl py-4 px-4 mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-semibold">
                          {existingRequest.status === 'pending' 
                            ? 'Already contacted, awaiting approval' 
                            : existingRequest.status === 'accepted'
                            ? 'Request accepted'
                            : 'Request rejected'}
                        </span>
                      </div>
                    </div>
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

