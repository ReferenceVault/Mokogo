import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Listing } from '@/types'
import {
  MapPin,
  Shield,
  Share2,
  Heart,
  Flag,
  Play,
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
  CheckCircle2
} from 'lucide-react'

interface ListingDetailContentProps {
  listingId: string
  onBack?: () => void
}

const ListingDetailContent = ({ listingId, onBack }: ListingDetailContentProps) => {
  const { allListings, user, currentListing, setAllListings } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [moveInDate, setMoveInDate] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check if current user is the owner of this listing
  const isOwner = currentListing?.id === listingId

  const foundListing = allListings.find(l => l.id === listingId)
  
  if (!foundListing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Listing not found</h1>
          {onBack && (
            <button onClick={onBack} className="text-orange-400 hover:text-orange-500">
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    )
  }

  // Type assertion to ensure TypeScript recognizes the full Listing type with 'fulfilled' status
  const listing: Listing = foundListing as Listing

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleContactHost = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Navigate to requests in dashboard
    if (onBack) {
      onBack()
      // Could trigger a view change to requests here
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

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const similarListings = allListings
    .filter(l => l.id !== listingId && l.city === listing.city)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
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
        </div>
      </section>

      {/* Listing Header Section */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-4 flex-wrap gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">{listing.title}</h1>
                {listing.boostEnabled && (
                  <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">Premium</span>
                )}
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
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                  src={listing.photos[0]} 
                  alt={listing.title} 
                />
              ) : (
                <div className="w-full h-[300px] lg:h-[350px] bg-gray-200 flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <button className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-medium">
                <Play className="w-3.5 h-3.5 inline mr-1.5" />
                Virtual Tour
              </button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-4">
              
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
                  {listing.notes && (
                    <p className="text-sm text-gray-700 leading-relaxed">{listing.notes}</p>
                  )}
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
                    <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center border-2 border-orange-400/20">
                      <span className="text-white font-semibold text-base">
                        {user?.name?.[0]?.toUpperCase() || 'H'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{user?.name || 'Host'}</h3>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      Hi! I'm {user?.name || 'a professional'} working in {listing.city}. I love meeting new people and creating a comfortable, friendly environment for my flatmates. I'm clean, organized, and respect personal space while being approachable for any questions or concerns.
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
            
            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                
                {/* Contact Card */}
                <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4">
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
                          <input 
                            type="date" 
                            value={moveInDate}
                            onChange={(e) => setMoveInDate(e.target.value)}
                            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            className="w-full border-0 p-0 text-xs focus:ring-0 bg-transparent" 
                          />
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
                      
                      <button 
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
                  </>
                  )}
                  
                  <div className="text-center text-xs text-gray-600 mb-3">
                    You won't be charged yet
                  </div>
                  
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
                        setIsSaved(!isSaved)
                      }}
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
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

