import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import {
  MapPin,
  Star,
  Shield,
  Share2,
  Heart,
  Flag,
  Play,
  Images,
  Bed,
  Bath,
  Square,
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Home,
  Utensils,
  ShoppingCart,
  Bus,
  Building,
  Train,
  Plane,
  CalendarPlus,
  Video,
  Heart as HeartIcon
} from 'lucide-react'

interface ListingDetailContentProps {
  listingId: string
  onBack?: () => void
}

const ListingDetailContent = ({ listingId, onBack }: ListingDetailContentProps) => {
  const { allListings, user } = useStore()
  const [isSaved, setIsSaved] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [moveInDate, setMoveInDate] = useState('')
  const [duration, setDuration] = useState('6 months')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const listing = allListings.find(l => l.id === listingId)

  if (!listing) {
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

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
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

  const reviews = [
    {
      id: '1',
      name: 'Sneha Patel',
      role: 'Marketing Executive',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: "Excellent experience staying with Priya! The room was exactly as described, very clean and comfortable. Great location with easy access to my office. Priya is a wonderful host - very responsive and helpful.",
      date: 'Stayed for 8 months • November 2023'
    },
    {
      id: '2',
      name: 'Anita Desai',
      role: 'Software Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4,
      text: "Great place to stay! The room is spacious and well-furnished. Kitchen facilities are excellent and the WiFi is super fast. Only minor issue was occasional noise from the main road, but overall highly recommended.",
      date: 'Stayed for 6 months • September 2023'
    },
    {
      id: '3',
      name: 'Kavya Singh',
      role: 'Business Analyst',
      avatar: 'https://i.pravatar.cc/150?img=7',
      rating: 5,
      text: "Perfect for working professionals! The location is unbeatable - so close to everything you need. Priya maintains the place beautifully and is very accommodating. Would definitely recommend to other female professionals.",
      date: 'Currently staying • Since August 2023'
    }
  ]

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
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Verified</span>
                  {listing.boostEnabled && (
                    <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">Premium</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-orange-400 mr-2" />
                  <span>{listing.locality}, {listing.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                  <span className="font-semibold">4.8</span>
                  <span className="mx-1">·</span>
                  <button className="text-orange-400 hover:text-orange-500 underline">12 reviews</button>
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
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                    <Square className="w-6 h-6 text-orange-400 mx-auto mb-1.5" />
                    <div className="text-sm font-semibold text-gray-900">200 sq ft</div>
                    <div className="text-xs text-gray-600">Room Size</div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Room Amenities</h3>
                    <div className="space-y-2">
                      {listing.flatAmenities.slice(0, 6).map((amenity, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Common Areas</h3>
                    <div className="space-y-2">
                      {listing.societyAmenities.slice(0, 6).map((amenity, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location & Nearby Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Location & Nearby</h2>
                
                <div className="mb-4">
                  <div className="bg-stone-100 h-48 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-1.5" />
                      <p className="text-sm text-gray-600">Interactive Map</p>
                      <p className="text-xs text-gray-500">{listing.locality}, {listing.city}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Transportation</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bus className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Bus Stop</span>
                        </div>
                        <span className="text-xs text-gray-600">2 min walk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Train className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Metro Station</span>
                        </div>
                        <span className="text-xs text-gray-600">15 min drive</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Plane className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Airport</span>
                        </div>
                        <span className="text-xs text-gray-600">45 min drive</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Points of Interest</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Business District</span>
                        </div>
                        <span className="text-xs text-gray-600">5 min walk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShoppingCart className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Shopping Mall</span>
                        </div>
                        <span className="text-xs text-gray-600">8 min walk</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Utensils className="w-4 h-4 text-orange-400 mr-2" />
                          <span className="text-sm text-gray-700">Restaurants</span>
                        </div>
                        <span className="text-xs text-gray-600">3 min walk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* House Rules Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">House Rules & Policies</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Allowed</h3>
                    <div className="space-y-2">
                      {listing.guestsAllowed && listing.guestsAllowed !== 'No' && (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-700">Guests ({listing.guestsAllowed})</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Cooking in Kitchen</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Work from Home</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Not Allowed</h3>
                    <div className="space-y-2">
                      {listing.smokingAllowed === 'No' && (
                        <div className="flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-sm text-gray-700">Smoking</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">Pets</span>
                      </div>
                      {listing.preferredGender === 'Female' && (
                        <div className="flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-sm text-gray-700">Male Guests</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">Parties</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1.5">Additional Information</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Security deposit: ₹{formatPrice(listing.deposit)} ({Math.round(listing.deposit / listing.rent)} months rent)</li>
                    <li>• Notice period: 1 month</li>
                    <li>• Electricity charges: Shared equally</li>
                    <li>• Maintenance: ₹500/month</li>
                  </ul>
                </div>
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
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-bold text-gray-900">{user?.name || 'Host'}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">Verified Host</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">Superhost</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-yellow-500" />
                        <span>4.8 rating</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3.5 h-3.5 text-orange-400 mr-1" />
                        <span>12 reviews</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 text-orange-400 mr-1" />
                        <span>Hosting since 2022</span>
                      </div>
                    </div>
                    
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
              
              {/* Reviews Section */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Reviews (12)</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-base font-bold text-gray-900">4.8</span>
                    <span className="text-sm text-gray-600">out of 5</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-stone-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                              <p className="text-xs text-gray-600">{review.role}</p>
                            </div>
                            <div className="flex items-center space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-1.5">{review.text}</p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    View All Reviews
                  </button>
                </div>
              </div>
              
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                
                {/* Contact Card */}
                <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4">
                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-gray-900 mb-1">₹{formatPrice(listing.rent)}</div>
                    <div className="text-sm text-gray-600">per month</div>
                    <div className="text-xs text-gray-500 mt-0.5">+ ₹500 maintenance</div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
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
                        <div className="text-xs font-semibold text-gray-700 uppercase mb-1">Duration</div>
                        <select 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full border-0 p-0 text-xs focus:ring-0 bg-transparent"
                        >
                          <option>6 months</option>
                          <option>12 months</option>
                          <option>Flexible</option>
                        </select>
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
                  
                  <button 
                    onClick={handleContactHost}
                    disabled={isSubmitting}
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
                  
                  <div className="text-center text-xs text-gray-600 mb-3">
                    You won't be charged yet
                  </div>
                  
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700">Monthly rent</span>
                      <span className="text-xs text-gray-900">₹{formatPrice(listing.rent)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700">Maintenance</span>
                      <span className="text-xs text-gray-900">₹500</span>
                    </div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-700">Security deposit</span>
                      <span className="text-xs text-gray-900">₹{formatPrice(listing.deposit)}</span>
                    </div>
                    <div className="border-t border-stone-200 pt-1.5 mt-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-sm text-gray-900">Total upfront</span>
                        <span className="text-sm text-gray-900">₹{formatPrice(listing.rent + 500 + listing.deposit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-white/35 p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center space-x-2 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm">
                      <CalendarPlus className="w-4 h-4 text-orange-400" />
                      <span>Schedule Visit</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm">
                      <Video className="w-4 h-4 text-orange-400" />
                      <span>Virtual Tour</span>
                    </button>
                    <button 
                      onClick={handleSave}
                      className="w-full flex items-center justify-center space-x-2 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm"
                    >
                      <HeartIcon className={`w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : 'text-red-500'}`} />
                      <span>Save to Favorites</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors text-sm">
                      <Share2 className="w-4 h-4 text-orange-400" />
                      <span>Share Listing</span>
                    </button>
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
                  to={`/listings/${similar.id}`}
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
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="text-xs font-semibold">4.6</span>
                        <span className="text-xs text-gray-500 ml-1">(8 reviews)</span>
                      </div>
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

      {/* FAQ Section */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">Get answers to common questions about this listing and the rental process</p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-stone-200 rounded-lg">
                <button 
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 text-sm text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ListingDetailContent

