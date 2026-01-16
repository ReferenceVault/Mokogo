import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SocialSidebar from '@/components/SocialSidebar'
import { useStore } from '@/store/useStore'
import { MapPin, TrendingUp, Users, Clock } from 'lucide-react'
import { listingsApi, ListingResponse } from '@/services/api'
import { Listing, VibeTagId } from '@/types'
import { formatRent } from '@/utils/formatters'
import { getListingMikoTags } from '@/utils/miko'
import MikoTagPills from '@/components/MikoTagPills'

const ExploreProperties = () => {
  const location = useLocation()
  const { allListings } = useStore()
  const [exploreListings, setExploreListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        const listings = await listingsApi.getAllPublic('live')
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
          mikoTags: listing.mikoTags,
        }))
        setExploreListings(mappedListings)
      } catch (error) {
        console.error('Error fetching public listings:', error)
        setExploreListings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [])

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const isMikoMode = searchParams.get('miko') === '1'
  const mikoTags = useMemo(() => {
    const tags = searchParams.get('tags') || ''
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean) as VibeTagId[]
  }, [searchParams])
  const roomTypePreference = useMemo(() => {
    const value = searchParams.get('roomType')
    if (value === 'private' || value === 'shared' || value === 'either') {
      return value
    }
    return null
  }, [searchParams])
  const filters = useMemo(() => ({
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    maxRent: searchParams.get('maxRent') || '',
    moveInDate: searchParams.get('moveInDate') || '',
    genderPreference: searchParams.get('genderPreference') || '',
  }), [searchParams])

  const filteredListings = useMemo(() => {
    const liveListings = exploreListings.filter(listing => listing.status === 'live')
    return liveListings.filter(listing => {
      const hasMikoFilters =
        Boolean(filters.city || filters.area || filters.maxRent || filters.moveInDate || filters.genderPreference) ||
        Boolean(roomTypePreference) ||
        mikoTags.length > 0

      const cityMatch = filters.city ? listing.city === filters.city : false
      const areaMatch = filters.area ? listing.locality === filters.area : false
      const maxRentMatch = filters.maxRent
        ? listing.rent <= parseInt(filters.maxRent)
        : false
      const moveInDateMatch = filters.moveInDate
        ? (() => {
            const filterDate = new Date(filters.moveInDate)
            filterDate.setHours(0, 0, 0, 0)
            const listingDate = new Date(listing.moveInDate)
            listingDate.setHours(0, 0, 0, 0)
            return listingDate >= filterDate
          })()
        : false
      const genderMatch = filters.genderPreference
        ? listing.preferredGender
          ? listing.preferredGender === 'Any' || listing.preferredGender === filters.genderPreference
          : false
        : false

      const roomTypeMatch = roomTypePreference
        ? (() => {
            const roomType = listing.roomType.toLowerCase()
            if (roomTypePreference === 'private') {
              return roomType.includes('private') || roomType.includes('master')
            }
            if (roomTypePreference === 'shared') {
              return roomType.includes('shared')
            }
            return true
          })()
        : false

      const mikoTagsMatch = mikoTags.length > 0
        ? (() => {
            const listingTags = getListingMikoTags(listing)
            return listingTags.some(tag => mikoTags.includes(tag))
          })()
        : false

      if (isMikoMode) {
        if (filters.city && !cityMatch) return false

        const hasOtherFilters =
          Boolean(filters.area || filters.maxRent || filters.moveInDate || filters.genderPreference) ||
          Boolean(roomTypePreference) ||
          mikoTags.length > 0

        if (!hasMikoFilters || !hasOtherFilters) {
          return true
        }

        return (
          areaMatch ||
          maxRentMatch ||
          moveInDateMatch ||
          genderMatch ||
          roomTypeMatch ||
          mikoTagsMatch
        )
      }

      if (filters.city && !cityMatch) return false
      if (filters.area && !areaMatch) return false
      if (filters.maxRent && !maxRentMatch) return false
      if (filters.moveInDate && !moveInDateMatch) return false
      if (filters.genderPreference && !genderMatch) return false
      if (roomTypePreference && !roomTypeMatch) return false

      return true
    })
  }, [exploreListings, filters, isMikoMode, mikoTags, roomTypePreference])

  // Calculate listings count per city from actual listings
  const getCityListingsCount = (cityName: string) => {
    return allListings.filter(l => l.city === cityName && l.status === 'live').length
  }

  // Only 4 cities: Pune, Mumbai, Hyderabad, Bangalore
  const cities = [
    { 
      name: 'Pune', 
      image: '/pune-city.png', 
      listings: getCityListingsCount('Pune') || 156,
      description: 'Calm cultural & IT hub surrounded by hills'
    },
    { 
      name: 'Mumbai', 
      image: '/mumbai-city.png', 
      listings: getCityListingsCount('Mumbai') || 245,
      description: 'Financial capital of India'
    },
    { 
      name: 'Hyderabad', 
      image: '/hyderabad-city.png', 
      listings: getCityListingsCount('Hyderabad') || 98,
      description: 'City of Pearls'
    },
    { 
      name: 'Bangalore', 
      image: '/bangalore-city.png', 
      listings: getCityListingsCount('Bangalore') || 189,
      description: 'Silicon Valley of India'
    }
  ]

  const stats = [
    { 
      value: allListings.filter(l => l.status === 'live').length, 
      label: 'Active Listings', 
      icon: TrendingUp 
    },
    { 
      value: cities.length, 
      label: 'Cities', 
      icon: MapPin 
    },
    { 
      value: '10,000+', 
      label: 'Happy Users', 
      icon: Users 
    },
    { 
      value: '24hrs', 
      label: 'Avg Response', 
      icon: Clock 
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SocialSidebar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-6 md:px-[10%] pt-16 pb-16 sm:pt-20 sm:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%),radial-gradient(circle_at_center,rgba(254,215,170,0.10),transparent_65%),radial-gradient(circle_at_top_right,rgba(255,237,213,0.08),transparent_70%)]" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-orange-800/80">
              Discover • Top Cities
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-tight text-gray-900">
              Explore Properties Across{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  India
                </span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-orange-200/40 -z-0 transform -skew-x-12" />
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl leading-relaxed text-gray-800">
              Discover verified listings in your favorite cities. Find your perfect room and roommate.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative px-6 md:px-[10%] py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#fef4f1] via-transparent to-transparent" />
          
          <div className="relative mx-auto max-w-7xl">
            {/* Cities Grid */}
            <div className="mb-16">
              <div className="text-center space-y-3 mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/50 bg-orange-200/30 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-800/80">
                  Browse by City
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  Explore Properties by{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                      City
                    </span>
                    <span className="absolute bottom-1.5 left-0 right-0 h-2.5 bg-orange-200/40 -z-0 transform -skew-x-12" />
                  </span>
                </h2>
                <p className="text-gray-700 text-base max-w-2xl mx-auto">
                  Browse through thousands of verified listings across India's most popular cities
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                {cities.map((city, index) => (
                  <Link
                    key={city.name}
                    to={`/city/${encodeURIComponent(city.name)}`}
                    className="group relative h-52 md:h-56 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 border border-orange-200/30 hover:border-orange-400 block transform hover:scale-105"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Image */}
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-orange-300 transition-colors duration-300">
                          {city.name}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-white/80 mb-2">{city.description}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-orange-300 transition-colors duration-300" />
                        <p className="text-sm text-white/90 font-medium">
                          {city.listings}+ Properties
                        </p>
                      </div>
                    </div>

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                      <div className="bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                        Explore
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Listings Grid */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isLoading ? 'Loading...' : `${filteredListings.length}+ Available Properties`}
                </h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-600">Loading listings...</p>
                  </div>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No listings available at the moment. Check back soon!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredListings.map((listing) => {
                    const listingTags = getListingMikoTags(listing)
                    return (
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
                          <MikoTagPills tags={listingTags} className="mb-1" />
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
                    )
                  })}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="relative overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-8 md:p-10 shadow-xl shadow-orange-100/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_60%)]" />
              <div className="relative">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-700">
                    Platform Statistics
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">Our Growing Community</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={index}
                      className="text-center group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-gray-700 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ExploreProperties
