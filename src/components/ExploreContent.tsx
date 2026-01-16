import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CustomSelect from '@/components/CustomSelect'
import { MoveInDateField } from '@/components/MoveInDateField'
import { MapPin, Home, Heart } from 'lucide-react'
import { Listing, VibeTagId } from '@/types'
import { getListingMikoTags, getMikoMatchPercent, getMikoMatchScore } from '@/utils/miko'
import MikoTagPills from '@/components/MikoTagPills'
import { listingsApi, ListingResponse } from '@/services/api'

interface ExploreContentProps {
  onListingClick: (listingId: string) => void
  hideFilters?: boolean
  headerTitle?: string
  headerSubtitle?: string
  showMikoTags?: boolean
  showClearMiko?: boolean
}

const ExploreContent = ({
  onListingClick,
  hideFilters = false,
  headerTitle,
  headerSubtitle,
  showMikoTags = true,
  showClearMiko = true
}: ExploreContentProps) => {
  const location = useLocation()
  const [exploreListings, setExploreListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter state
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search)
    return {
      city: params.get('city') || '',
      area: params.get('area') || '',
      maxRent: params.get('maxRent') || '',
      moveInDate: params.get('moveInDate') || '',
      genderPreference: params.get('genderPreference') || '',
    }
  })

  const [isMikoMode, setIsMikoMode] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('miko') === '1'
  })
  const [mikoTags, setMikoTags] = useState<VibeTagId[]>(() => {
    const params = new URLSearchParams(location.search)
    const tags = params.get('tags') || ''
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean) as VibeTagId[]
  })
  const [roomTypePreference, setRoomTypePreference] = useState<'private' | 'shared' | 'either' | null>(() => {
    const params = new URLSearchParams(location.search)
    const value = params.get('roomType')
    if (value === 'private' || value === 'shared' || value === 'either') {
      return value
    }
    return null
  })

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

  // Get all live listings
  const allLiveListings = exploreListings.filter(listing => listing.status === 'live')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setFilters({
      city: params.get('city') || '',
      area: params.get('area') || '',
      maxRent: params.get('maxRent') || '',
      moveInDate: params.get('moveInDate') || '',
      genderPreference: params.get('genderPreference') || '',
    })
    setIsMikoMode(params.get('miko') === '1')
    const tags = params.get('tags') || ''
    setMikoTags(
      tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean) as VibeTagId[]
    )
    const roomType = params.get('roomType')
    if (roomType === 'private' || roomType === 'shared' || roomType === 'either') {
      setRoomTypePreference(roomType)
    } else {
      setRoomTypePreference(null)
    }
  }, [location.search])

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

      // Standard search: all selected filters must match
      if (filters.city && !cityMatch) return false
      if (filters.area && !areaMatch) return false
      if (filters.maxRent && !maxRentMatch) return false
      if (filters.moveInDate && !moveInDateMatch) return false
      if (filters.genderPreference && !genderMatch) return false
      if (roomTypePreference && !roomTypeMatch) return false

      return true
    })
  }, [allLiveListings, filters, isMikoMode, roomTypePreference, mikoTags])

  const rankedListings = useMemo(() => {
    if (!isMikoMode || mikoTags.length === 0) {
      return filteredListings
    }

    return [...filteredListings]
      .map(listing => {
        const listingTags = getListingMikoTags(listing)
        return {
          listing,
          score: getMikoMatchScore(mikoTags, listingTags),
        }
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.listing.createdAt).getTime() - new Date(a.listing.createdAt).getTime()
      })
      .map(item => item.listing)
  }, [filteredListings, isMikoMode, mikoTags])

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

  const renderMikoTags = () => {
    if (!showMikoTags || !isMikoMode || mikoTags.length === 0) return null
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold border border-orange-200">
          Miko Vibe Active
        </span>
        <MikoTagPills tags={mikoTags} max={4} />
        {showClearMiko && (
          <button
            onClick={() => {
              setIsMikoMode(false)
              setMikoTags([])
              setRoomTypePreference(null)
            }}
            className="text-orange-600 font-semibold hover:text-orange-700"
          >
            Clear Miko
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {!hideFilters ? (
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
            {renderMikoTags()}
          </div>
        </section>
      ) : (
        <section className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {headerTitle || 'MIKO Vibe Search Results'}
              </h2>
              {headerSubtitle && (
                <p className="text-sm text-gray-600">{headerSubtitle}</p>
              )}
            </div>
            {renderMikoTags()}
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <section className="py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16 text-gray-600">
              Loading listings...
            </div>
          ) : rankedListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
              {rankedListings.map((listing) => {
                const listingTags = getListingMikoTags(listing)
                const matchPercent = isMikoMode ? getMikoMatchPercent(mikoTags, listingTags) : 0
                return (
                <button
                  key={listing.id}
                  onClick={() => onListingClick(listing.id)}
                  className="bg-white/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-white/60 text-left flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-mokogo-gray flex items-center justify-center rounded-t-2xl">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle save/favorite
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          // Handle save/favorite
                        }
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </span>
                    <span className="absolute top-3 left-3 px-3 py-1 bg-mokogo-primary text-white rounded-full text-xs font-medium shadow-md">
                      {listing.roomType === 'Private Room' ? 'Private' : listing.roomType === 'Master Room' ? 'Master' : 'Shared'}
                    </span>
                    {isMikoMode && mikoTags.length > 0 && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-orange-600 rounded-full border border-orange-200 shadow-sm">
                        {matchPercent}% Vibe Match
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <MikoTagPills tags={listingTags} className="mb-1" />
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

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-auto">
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
              )})}
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
