import { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import CustomSelect from '@/components/CustomSelect'
import { MoveInDateField } from '@/components/MoveInDateField'
import { MapPin, Home, Heart } from 'lucide-react'

interface ExploreContentProps {
  onListingClick: (listingId: string) => void
}

const ExploreContent = ({ onListingClick }: ExploreContentProps) => {
  const { allListings } = useStore()

  // Filter state
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    maxRent: '',
    moveInDate: '',
    genderPreference: ''
  })

  // Get all live listings
  const allLiveListings = allListings.filter(listing => listing.status === 'live')

  // Get unique cities from all listings
  const availableCities = useMemo(() => {
    const cities = new Set(allLiveListings.map(listing => listing.city))
    return Array.from(cities).sort().map(city => ({ value: city, label: city }))
  }, [allLiveListings])

  // Get unique areas based on selected city
  const availableAreas = useMemo(() => {
    if (!filters.city) return []
    const cityListings = allLiveListings.filter(listing => listing.city === filters.city)
    const areas = new Set(cityListings.map(listing => listing.locality))
    return Array.from(areas).sort().map(area => ({ value: area, label: area }))
  }, [allLiveListings, filters.city])

  // Apply filters to listings
  const filteredListings = useMemo(() => {
    return allLiveListings.filter(listing => {
      // City filter
      if (filters.city && listing.city !== filters.city) {
        return false
      }
      
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
        filterDate.setHours(0, 0, 0, 0)
        const listingDate = new Date(listing.moveInDate)
        listingDate.setHours(0, 0, 0, 0)
        if (listingDate < filterDate) {
          return false
        }
      }
      
      // Gender Preference filter
      if (filters.genderPreference) {
        if (listing.preferredGender && listing.preferredGender !== 'Any') {
          if (listing.preferredGender !== filters.genderPreference) {
            return false
          }
        }
      }
      
      return true
    })
  }, [allLiveListings, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Clear area filter if city changes
    if (key === 'city') {
      setFilters(prev => ({ ...prev, city: value, area: '' }))
    }
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      area: '',
      maxRent: '',
      moveInDate: '',
      genderPreference: ''
    })
  }

  const hasActiveFilters = filters.city || filters.area || filters.maxRent || filters.moveInDate || filters.genderPreference

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 px-8 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_60%)]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Explore Properties
            </h1>
            <p className="text-sm text-gray-700">
              Browse and discover available rooms in your preferred location
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
                label="City"
                value={filters.city}
                onValueChange={(value) => handleFilterChange('city', value)}
                placeholder="All Cities"
                options={[
                  { value: '', label: 'All Cities' },
                  ...availableCities
                ]}
              />
            </div>
            {filters.city && (
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
            )}
            <div className="flex-1 relative z-20">
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
            <div className="flex-1 relative z-20 [&_button]:h-[52px] [&_button]:py-0">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Move-in Date
              </label>
              <MoveInDateField
                value={filters.moveInDate}
                onChange={(date) => handleFilterChange('moveInDate', date)}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                hideLabel={true}
                numberOfMonths={2}
                className="!h-[52px] !rounded-xl !border !border-mokogo-gray"
              />
            </div>
            <div className="flex-1 relative z-20">
              <CustomSelect
                label="Gender Preference"
                value={filters.genderPreference}
                onValueChange={(value) => handleFilterChange('genderPreference', value)}
                placeholder="Select"
                options={[
                  { value: '', label: 'Any' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
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

      {/* Listings Grid */}
      <section className="py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {filteredListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => onListingClick(listing.id)}
                  className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 text-left"
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
                      <div className="w-full h-full bg-mokogo-gray flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle save/favorite
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
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
                      <MapPin className="w-4 h-4" />
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
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-24 h-24 mx-auto bg-mokogo-primary/10 rounded-full flex items-center justify-center">
                <Home className="w-12 h-12 text-mokogo-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No properties found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters to see more results
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary mt-4"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ExploreContent
