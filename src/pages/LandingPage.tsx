import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { useStore } from '@/store/useStore'
import { Listing, VibeTagId } from '@/types'
import { listingsApi, ListingResponse } from '@/services/api'
import CustomSelect from '@/components/CustomSelect'
import { formatRent } from '@/utils/formatters'
import { MoveInDateField } from '@/components/MoveInDateField'
import MikoVibeQuiz from '@/components/MikoVibeQuiz'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { allListings, setAllListings, user } = useStore()
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    moveInDate: '',
    maxRent: '',
    genderPreference: ''
  })
  const [searchMode, setSearchMode] = useState<'standard' | 'miko'>('standard')
  const [isMikoOpen, setIsMikoOpen] = useState(false)
  const [isLoadingListings, setIsLoadingListings] = useState(true)

  const searchCities = [
    'Pune'
  ]

  // Fetch all live listings from API
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoadingListings(true)
      try {
        const listings = await listingsApi.getAllPublic('live')
        
        // Map API response to frontend format
        const mappedListings: Listing[] = listings.map((listing: ListingResponse) => ({
          id: listing._id || listing.id,
          title: listing.title,
          city: listing.city || '',
          locality: listing.locality || '',
          societyName: listing.societyName,
          bhkType: listing.bhkType || '',
          roomType: listing.roomType || '',
          rent: listing.rent || 0,
          deposit: listing.deposit || 0,
          moveInDate: listing.moveInDate || '',
          furnishingLevel: listing.furnishingLevel || '',
          bathroomType: listing.bathroomType,
          flatAmenities: listing.flatAmenities || [],
          societyAmenities: listing.societyAmenities || [],
          preferredGender: listing.preferredGender || '',
          description: listing.description,
          photos: listing.photos || [],
          status: listing.status,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
        }))
        
        setAllListings(mappedListings)
      } catch (error) {
        console.error('Error fetching public listings:', error)
        // Keep existing listings or empty array on error
      } finally {
        setIsLoadingListings(false)
      }
    }

    fetchListings()
  }, [setAllListings])


  const handleSearch = () => {
    // Navigate to city listings page if city is selected
    if (searchFilters.city) {
      navigate(`/city/${encodeURIComponent(searchFilters.city)}`)
    } else {
      // If no city selected, navigate to explore page
      navigate('/explore')
    }
  }

  const handleMikoComplete = (result: { tags: VibeTagId[]; roomTypePreference?: 'private' | 'shared' | 'either'; city?: string }) => {
    const params = new URLSearchParams()
    params.set('miko', '1')
    if (result.tags.length) {
      params.set('tags', result.tags.join(','))
    }
    if (result.roomTypePreference) {
      params.set('roomType', result.roomTypePreference)
    }
    if (result.city && result.city !== 'any') {
      params.set('city', result.city)
    } else if (searchFilters.city) {
      params.set('city', searchFilters.city)
    }
    if (searchFilters.maxRent) params.set('maxRent', searchFilters.maxRent)
    if (searchFilters.moveInDate) params.set('moveInDate', searchFilters.moveInDate)
    if (searchFilters.genderPreference) params.set('genderPreference', searchFilters.genderPreference)

    setIsMikoOpen(false)
    if (user) {
      navigate(`/dashboard?view=miko&${params.toString()}`)
    } else {
      navigate(`/miko-results?${params.toString()}`)
    }
  }


  // Get city listings count from actual listings
  const getCityListingsCount = (cityName: string) => {
    return allListings.filter(l => l.city === cityName && l.status === 'live').length
  }

  const cities = [
    { 
      name: 'Pune', 
      image: '/pune-city.png', 
      listings: getCityListingsCount('Pune') || 156,
      active: true
    },
    { 
      name: 'Mumbai', 
      image: '/mumbai-city.png', 
      listings: getCityListingsCount('Mumbai') || 245,
      active: false
    },
    { 
      name: 'Bangalore', 
      image: '/bangalore-city.png', 
      listings: getCityListingsCount('Bangalore') || 189,
      active: false
    },
    { 
      name: 'Hyderabad', 
      image: '/hyderabad-city.png', 
      listings: getCityListingsCount('Hyderabad') || 98,
      active: false
    },
    {
      name: 'Delhi NCR',
      image: '/delhi-city.png',
      listings: getCityListingsCount('Delhi NCR') || 0,
      active: false
    }
  ]


  const testimonials = [
    {
      id: 1,
      name: 'Aarohi Kulkarni',
      role: 'Product Analyst',
      location: 'Pune, India',
      image: 'https://i.pravatar.cc/150?img=44',
      rating: 5,
      text: 'No brokers, no hassle. Direct contact with the owner saved me so much time and money!'
    },
    {
      id: 2,
      name: 'Sahil Mehta',
      role: 'Startup Founder',
      location: 'Pune, India',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'Real listings and real people. I found a great place without any middlemen.'
    },
    {
      id: 3,
      name: 'Neha Joshi',
      role: 'UX Designer',
      location: 'Pune, India',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'Direct owner contact made the process fast and transparent. Highly recommend!'
    }
  ]

  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const getCirclePosition = (index: number) => {
    const total = testimonials.length
    const angle = ((index - activeTestimonialIndex) * (360 / total)) - 90
    const radius = 157 // Reduced by 30% from 224
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    return { x, y }
  }

  const displayedListings = allListings.filter(l => l.status === 'live').slice(0, 8)

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section with Search - Full Width Background */}
        <section className="relative w-full bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 pb-16 md:pb-20 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-5">
            <div className="relative bg-white/80 backdrop-blur-xl border border-orange-200/50 shadow-2xl rounded-3xl p-8 md:p-12">
              {/* Inner decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-orange-100/30 pointer-events-none rounded-3xl" />
              
              <div className="relative space-y-10">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Find Your Perfect{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Room & Roommate
                      </span>
                      <span className="absolute bottom-2 left-0 right-0 h-3 bg-orange-200/40 -z-0 transform -skew-x-12" />
                    </span>
                  </h1>
                  <p className="text-gray-700 text-lg md:text-xl max-w-[773px] mx-auto leading-relaxed">
                    Start your home search in Pune.
                  </p>
                  <p className="text-orange-600 text-sm md:text-base max-w-[773px] mx-auto font-semibold">
                    ⚡ Verified listings &nbsp; • &nbsp; 🤝 Direct owner contact &nbsp; • &nbsp; 💸 Zero brokerage
                  </p>
                  <p className="text-gray-600 text-sm md:text-base max-w-[773px] mx-auto">
                    Launching in Pune. Expanding across India soon.
                  </p>
                </div>

                {/* Search Card */}
                <div className="relative bg-white/90 backdrop-blur-md rounded-xl p-5 md:p-7 shadow-xl border border-orange-200/50 hover:shadow-2xl transition-all duration-300 hover:border-orange-300">
                  <div className="flex flex-wrap items-center gap-3 justify-between mb-5">
                    <div className="inline-flex rounded-full bg-orange-50 border border-orange-200 p-1 text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => setSearchMode('standard')}
                        className={`px-4 py-2 rounded-full transition-all ${
                          searchMode === 'standard'
                            ? 'bg-white text-orange-600 shadow-md'
                            : 'text-orange-500 hover:text-orange-600'
                        }`}
                      >
                        Standard Search
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchMode('miko')}
                        className={`px-4 py-2 rounded-full transition-all ${
                          searchMode === 'miko'
                            ? 'bg-white text-orange-600 shadow-md'
                            : 'text-orange-500 hover:text-orange-600'
                        }`}
                      >
                        🔮 Miko Vibe Search
                      </button>
                    </div>
                    <span className="text-xs md:text-sm text-gray-600">
                      Answer 6 quick questions. Get vibe-matched homes.
                    </span>
                  </div>

                  {searchMode === 'standard' ? (
                    <div className="grid md:grid-cols-5 gap-3.5 items-end">
                      <div className="[&_button]:h-[50px] [&_button]:py-0 group">
                        <CustomSelect
                          label="Select City"
                          value={searchFilters.city}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, city: value })}
                          placeholder="Select your city"
                          options={searchCities.map(city => ({ value: city, label: city }))}
                        />
                      </div>
                      <div className="[&_button]:h-[50px] [&_button]:py-0 group">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Move-in Date
                        </label>
                        <MoveInDateField
                          value={searchFilters.moveInDate}
                          onChange={(date) => setSearchFilters({ ...searchFilters, moveInDate: date })}
                          min={new Date().toISOString().split('T')[0]}
                          hideLabel={true}
                          className="!h-[50px] !rounded-lg !border-2 !border-gray-200 hover:!border-orange-300 focus:!ring-2 focus:!ring-orange-400 focus:!border-orange-400"
                        />
                      </div>
                      <div className="[&_button]:h-[50px] [&_button]:py-0 group">
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Max Rent (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 20000"
                          value={searchFilters.maxRent}
                          onChange={(e) => setSearchFilters({ ...searchFilters, maxRent: e.target.value })}
                          className="w-full h-[50px] px-3.5 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white transition-all duration-300 hover:border-orange-300 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <div className="[&_button]:h-[50px] [&_button]:py-0 group">
                        <CustomSelect
                          label="Gender Preference"
                          value={searchFilters.genderPreference}
                          onValueChange={(value) => setSearchFilters({ ...searchFilters, genderPreference: value })}
                          placeholder="Select"
                          options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                            { value: 'Other', label: 'Other' }
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1.5 opacity-0">
                          Search
                        </label>
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="group relative w-full h-[50px] bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden text-sm"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="relative z-10">Search</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <p className="text-lg font-semibold text-gray-900">Find your vibe with Miko</p>
                        <p className="text-sm text-gray-600">
                          Get matched with homes that fit your lifestyle, not just your budget.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMikoOpen(true)}
                        className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                      >
                        Start Miko Vibe Search
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="space-y-16 py-12 px-6 md:px-12">
          {/* Listings Grid */}
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLoadingListings ? 'Loading...' : `${allListings.filter(l => l.status === 'live').length}+ Available Properties`}
              </h2>
              <Link 
                to="/explore"
                className="text-orange-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all group hover:text-orange-600"
              >
                View All
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {isLoadingListings ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-600">Loading listings...</p>
                </div>
              </div>
            ) : displayedListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No listings available at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 block"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-mokogo-gray" />
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md">
                      {listing.roomType === 'Private Room' ? 'Private' : listing.roomType === 'Master Room' ? 'Master' : 'Shared'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
                        {listing.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{listing.locality}, {listing.city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{formatRent(listing.rent)}</p>
                        <p className="text-xs text-gray-600">per month</p>
                      </div>
                      <span className="btn-primary text-sm px-4 py-2 inline-block text-center">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              </div>
            )}

            {!isLoadingListings && displayedListings.length > 0 && (
              <div className="text-center pt-4">
                <Link to="/explore">
                  <button className="btn-secondary">
                    Load More Listings
                  </button>
                </Link>
              </div>
            )}
          </section>

          {/* Popular Areas */}
          <section className="relative max-w-7xl mx-auto py-8 md:py-9 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl" />
            </div>

            <div className="relative space-y-10">
              {/* Header */}
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-800/80">
                  Discover • Top Locations
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Cities We’re Launching In
                </h2>
                <p className="text-gray-700 text-base max-w-2xl mx-auto leading-relaxed">
                  We’re starting with Pune and rolling out city by city across India.
                </p>
              </div>

              {/* Cities Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
                {cities.map((city, index) => {
                  const wrapperClasses = [
                    'group relative h-52 md:h-56 rounded-xl overflow-hidden shadow-lg border border-orange-200/30 block transform transition-all duration-300',
                    city.active
                      ? 'cursor-pointer hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-400 hover:scale-105'
                      : 'cursor-not-allowed opacity-70 grayscale'
                  ].join(' ')

                  const cardContent = (
                    <>
                      {/* Image */}
                      <img
                        src={city.image}
                        alt={city.name}
                        className={`w-full h-full object-cover ${city.active ? 'group-hover:scale-110 transition-transform duration-700' : ''}`}
                      />
                      
                      {/* Gradient Overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent ${
                          city.active ? 'group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300' : ''
                        }`}
                      />
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl md:text-2xl font-bold ${city.active ? 'group-hover:text-orange-300 transition-colors duration-300' : ''}`}>
                            {city.name}
                          </h3>
                          {city.active && (
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        {city.active ? (
                          <p className="text-sm text-white/90 font-medium">Live</p>
                        ) : (
                          <p className="text-sm text-white/90 font-medium">Coming soon</p>
                        )}
                      </div>

                      {/* Top Badge */}
                      {city.active ? (
                        <div className="absolute top-4 left-4">
                          <div className="bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                            Live
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                            Coming soon
                          </div>
                        </div>
                      )}

                      {/* Shine Effect */}
                      {city.active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      )}
                    </>
                  )

                  return city.active ? (
                    <Link
                      key={city.name}
                      to={`/city/${encodeURIComponent(city.name)}`}
                      className={wrapperClasses}
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div
                      key={city.name}
                      className={wrapperClasses}
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      {cardContent}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Success Stories - Circular Testimonials */}
          <section className="py-[48px] bg-gradient-to-b from-orange-50/50 to-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-orange-100/50 rounded-full blur-3xl" />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border-2 border-dashed border-orange-200/50 rounded-full"
              style={{
                animation: 'spin 60s linear infinite'
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[525px] h-[525px] border border-orange-200/30 rounded-full"
              style={{
                animation: 'spin 80s linear infinite reverse'
              }}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
              {/* Section Header */}
              <div className="text-center mb-4">
                <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text text-[10px] font-semibold tracking-wider uppercase mb-1.5">
                  Success Stories
                </span>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1.5">
                  Voices of
                  <span className="text-orange-500"> Success</span>
                </h2>
                <p className="text-xs text-gray-600">
                  See what our happy users have to say about their experience
                </p>
              </div>

              {/* Circular Testimonials Layout */}
              <div className="relative min-h-[392px] flex items-center justify-center">
                {/* Orbiting Profile Circles - Desktop - Show ALL */}
                <div className="hidden lg:block absolute inset-0">
                  {testimonials.map((testimonial, index) => {
                    const pos = getCirclePosition(index)
                    const isActive = index === activeTestimonialIndex
                    
                    return (
                      <div
                        key={testimonial.id}
                        className="absolute left-1/2 top-1/2 cursor-pointer"
                        style={{
                          transform: `translate(${pos.x - 22}px, ${pos.y - 22}px) scale(${isActive ? 1.3 : 0.9})`,
                          zIndex: isActive ? 20 : 10,
                          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        onClick={() => setActiveTestimonialIndex(index)}
                      >
                        <div 
                          className={`relative w-11 h-11 rounded-full overflow-hidden border-[3px] transition-all duration-300 ${
                            isActive 
                              ? 'border-orange-500 shadow-xl shadow-orange-500/30' 
                              : 'border-white shadow-lg hover:border-orange-300'
                          }`}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = 'scale(1.1)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.transform = 'scale(1)'
                            }
                          }}
                        >
                          <img 
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                          {isActive && (
                            <div 
                              className="absolute inset-0 bg-orange-500/20"
                              style={{
                                animation: 'fadeIn 0.3s ease-in'
                              }}
                            />
                          )}
                        </div>
                        
                        {/* Active Indicator Ring */}
                        {isActive && (
                          <div 
                            className="absolute -inset-2 border-2 border-orange-400 rounded-full"
                            style={{
                              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Center Content Card */}
                <div className="relative z-30 max-w-lg mx-auto">
                  <div
                    key={activeTestimonialIndex}
                    className="bg-white rounded-2xl shadow-2xl shadow-orange-100/50 p-4 lg:p-6 text-center"
                    style={{
                      animation: 'fadeInScale 0.4s ease-out'
                    }}
                  >
                    {/* Quote Icon */}
                    <div 
                      className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 -mt-8 shadow-lg"
                      style={{
                        animation: 'rotateIn 0.4s ease-out'
                      }}
                    >
                      <Quote className="w-4 h-4 text-white" />
                    </div>

                    {/* Mobile Profile Image */}
                    <div className="lg:hidden mb-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-[3px] border-orange-200 mx-auto shadow-lg">
                        <img 
                          src={testimonials[activeTestimonialIndex].image}
                          alt={testimonials[activeTestimonialIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center gap-0.5 mb-3">
                      {[...Array(testimonials[activeTestimonialIndex].rating)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            animation: `fadeInScale 0.3s ease-out ${i * 0.1}s both`
                          }}
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-sm lg:text-base text-gray-700 leading-relaxed mb-3.5 italic">
                      &ldquo;{testimonials[activeTestimonialIndex].text}&rdquo;
                    </p>

                    {/* Divider */}
                    <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-3" />

                    {/* Name & Info */}
                    <h3 className="text-base font-bold text-gray-900 mb-0.5">
                      {testimonials[activeTestimonialIndex].name}
                    </h3>
                    <p className="text-orange-600 text-xs mb-1.5">
                      {testimonials[activeTestimonialIndex].location}
                    </p>
                    
                    <div className="inline-flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-full">
                      <span className="text-xs text-gray-700">{testimonials[activeTestimonialIndex].role}</span>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={prevTestimonial}
                      className="w-9 h-9 rounded-full border-2 border-orange-200 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center shadow-md"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="w-3 h-3 text-orange-500" />
                    </button>

                    {/* Dots - Mobile */}
                    <div className="flex items-center gap-1.5 lg:hidden">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveTestimonialIndex(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === activeTestimonialIndex 
                              ? 'w-4 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600' 
                              : 'w-1.5 h-1.5 bg-gray-300 hover:bg-orange-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={nextTestimonial}
                      className="w-9 h-9 rounded-full border-2 border-orange-200 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center shadow-md"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="w-3 h-3 text-orange-500" />
                    </button>
                  </div>
                </div>

                {/* Decorative Circles */}
                <div 
                  className="absolute top-7 left-7 w-14 h-14 bg-orange-400/20 rounded-full"
                  style={{
                    animation: 'floatY 4s ease-in-out infinite'
                  }}
                />
                <div 
                  className="absolute bottom-7 right-7 w-11 h-11 bg-orange-300/20 rounded-full"
                  style={{
                    animation: 'floatY 5s ease-in-out infinite reverse'
                  }}
                />
                <div 
                  className="absolute top-1/3 right-14 w-8 h-8 bg-orange-400/20 rounded-full"
                  style={{
                    animation: 'floatX 6s ease-in-out infinite'
                  }}
                />
              </div>

            </div>

            <style>{`
              @keyframes spin-slow {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
              }
              @keyframes spin-reverse {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(-360deg); }
              }
              @keyframes bounce-slow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
              @keyframes bounce-slow-delay {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(20px); }
              }
              @keyframes float {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(15px); }
              }
              .animate-spin-slow {
                animation: spin-slow 60s linear infinite;
              }
              .animate-spin-reverse {
                animation: spin-reverse 80s linear infinite;
              }
              .animate-bounce-slow {
                animation: bounce-slow 4s ease-in-out infinite;
              }
              .animate-bounce-slow-delay {
                animation: bounce-slow-delay 5s ease-in-out infinite;
              }
              .animate-float {
                animation: float 6s ease-in-out infinite;
              }
            `}</style>
          </section>
        </div>

        {/* Newsletter */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden">
              <div className="relative max-w-[1177px] mx-auto">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900">Stay Updated!</h2>
                  <p className="text-gray-700">
                    Subscribe to get updates on new listings in your area and exclusive deals
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-3.5 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/90 backdrop-blur-sm border border-mokogo-gray"
                    />
                    <button className="px-6 py-3.5 rounded-xl bg-mokogo-primary text-white font-medium hover:bg-mokogo-primary-dark transition-colors shadow-md">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MikoVibeQuiz
        isOpen={isMikoOpen}
        onClose={() => setIsMikoOpen(false)}
        onComplete={handleMikoComplete}
      />
    </div>
  )
}

export default LandingPage
