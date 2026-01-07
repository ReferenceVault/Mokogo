import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'
import CustomSelect from '@/components/CustomSelect'

const CityListings = () => {
  const { cityName } = useParams<{ cityName: string }>()
  const navigate = useNavigate()
  const { allListings } = useStore()

  // Scroll to top when component mounts or city changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [cityName])

  // Filter state
  const [filters, setFilters] = useState({
    area: '',
    maxRent: '',
    moveInDate: '',
    genderPreference: ''
  })

  // Decode the city name from URL
  const decodedCityName = cityName ? decodeURIComponent(cityName) : ''
  
  // Get all listings for the city first
  const cityListingsBase = allListings.filter(
    listing => listing.city === decodedCityName && listing.status === 'live'
  )

  // Get unique areas from city listings
  const availableAreas = useMemo(() => {
    const areas = new Set(cityListingsBase.map(listing => listing.locality))
    return Array.from(areas).sort().map(area => ({ value: area, label: area }))
  }, [cityListingsBase])

  // Apply filters to listings
  const cityListings = useMemo(() => {
    return cityListingsBase.filter(listing => {
      // Area filter
      if (filters.area && listing.locality !== filters.area) {
        return false
      }
      
      // Max Rent filter
      if (filters.maxRent) {
        const maxRent = parseInt(filters.maxRent)
        if (listing.rent > maxRent) {
          return false
        }
      }
      
      // Move-in Date filter
      if (filters.moveInDate) {
        const filterDate = new Date(filters.moveInDate)
        filterDate.setHours(0, 0, 0, 0) // Reset time for accurate comparison
        const listingDate = new Date(listing.moveInDate)
        listingDate.setHours(0, 0, 0, 0)
        // Show listings where move-in date is on or after the selected date
        if (listingDate < filterDate) {
          return false
        }
      }
      
      // Gender Preference filter
      if (filters.genderPreference) {
        // If filter is set and listing has a preference, they must match
        // If listing preference is 'Any', it matches all filters
        if (listing.preferredGender && listing.preferredGender !== 'Any') {
          if (listing.preferredGender !== filters.genderPreference) {
            return false
          }
        }
      }
      
      return true
    })
  }, [cityListingsBase, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      area: '',
      maxRent: '',
      moveInDate: '',
      genderPreference: ''
    })
  }

  const hasActiveFilters = filters.area || filters.maxRent || filters.moveInDate || filters.genderPreference

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-4 md:py-5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/explore')}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-mokogo-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Explore
                </button>
                <span className="text-gray-400">•</span>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Properties in <span className="text-mokogo-primary">{decodedCityName}</span>
                </h1>
              </div>
              <p className="text-sm text-gray-700">
                {cityListings.length} {cityListings.length === 1 ? 'property' : 'properties'} available
                {hasActiveFilters && (
                  <span className="text-mokogo-primary ml-1">
                    (filtered from {cityListingsBase.length})
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 relative z-20">
                <CustomSelect
                  label="Area"
                  value={filters.area}
                  onValueChange={(value) => handleFilterChange('area', value)}
                  placeholder="All Areas"
                  options={[
                    { value: '', label: 'All Areas' },
                    ...availableAreas
                  ]}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Max Rent (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 20000"
                  value={filters.maxRent}
                  onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Move-in Date
                </label>
                <input
                  type="date"
                  value={filters.moveInDate}
                  onChange={(e) => handleFilterChange('moveInDate', e.target.value)}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full h-[52px] px-4 rounded-xl border border-mokogo-gray focus:outline-none focus:ring-2 focus:ring-mokogo-primary bg-white/80"
                />
              </div>
              <div className="flex-1 relative z-20">
                <CustomSelect
                  label="Gender Preference"
                  value={filters.genderPreference}
                  onValueChange={(value) => handleFilterChange('genderPreference', value)}
                  placeholder="Any"
                  options={[
                    { value: '', label: 'Any' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>
              {hasActiveFilters && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 opacity-0">
                    Clear
                  </label>
                  <button
                    onClick={clearFilters}
                    className="h-[52px] px-6 rounded-xl border border-mokogo-gray bg-white/80 hover:bg-white transition-colors text-gray-700 font-medium whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {cityListings.length > 0 ? (
              <>
                {/* Listings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cityListings.map((listing) => (
                    <Link
                      key={listing.id}
                      to={`/dashboard?listing=${listing.id}`}
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
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Handle save/favorite
                          }}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
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

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{listing.bhkType}</span>
                          <span>•</span>
                          <span>{listing.furnishingLevel}</span>
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
              </>
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-mokogo-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No properties found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We don't have any listings in {decodedCityName} at the moment. Check back soon or explore other cities!
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={() => navigate('/explore')}
                    className="btn-secondary"
                  >
                    Explore Other Cities
                  </button>
                  <Link to="/" className="btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CityListings

