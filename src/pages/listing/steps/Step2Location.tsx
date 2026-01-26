import { useEffect, useState, useRef, useCallback } from 'react'
import { Listing } from '@/types'
import CustomSelect from '@/components/CustomSelect'
import { placesApi, AutocompletePrediction } from '@/services/api'

interface Step2LocationProps {
  data: Partial<Listing>
  onChange: (updates: Partial<Listing>) => void
  error?: string
  onClearError?: (field?: string) => void
}

const cities = [
  'Mumbai', 'Bangalore', 'Pune', 'Delhi NCR', 'Hyderabad'
]

const Step2Location = ({ data, onChange, error, onClearError }: Step2LocationProps) => {
  const [suggestions, setSuggestions] = useState<AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localityError, setLocalityError] = useState<string>('')
  const [inputValue, setInputValue] = useState(data.locality || '')
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync input value with data.locality when it changes externally
  useEffect(() => {
    if (data.locality !== inputValue) {
      setInputValue(data.locality || '')
    }
  }, [data.locality])

  // Clear errors when fields become valid
  useEffect(() => {
    if (data.city && data.city.trim() && error && onClearError) {
      onClearError('city')
    }
  }, [data.city, error, onClearError])

  useEffect(() => {
    if (data.placeId && data.locality && data.locality.trim() && error && onClearError) {
      onClearError('locality')
      setLocalityError('')
    }
  }, [data.placeId, data.locality, error, onClearError])

  // Clear step error when both fields are filled and placeId exists
  useEffect(() => {
    if (data.city && data.city.trim() && data.locality && data.locality.trim() && data.placeId && error && onClearError) {
      onClearError()
    }
  }, [data.city, data.locality, data.placeId, error, onClearError])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch autocomplete suggestions with debouncing
  const fetchSuggestions = useCallback(async (input: string, city: string) => {
    if (!input || input.trim().length < 2 || !city) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await placesApi.getAutocomplete(input.trim(), city)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced input handler
  const handleLocalityInputChange = (value: string) => {
    setInputValue(value)
    
    // Clear placeId and related data when user types (invalidates previous selection)
    if (data.placeId) {
      onChange({
        locality: value,
        placeId: undefined,
        latitude: undefined,
        longitude: undefined,
        formattedAddress: undefined,
      })
    } else {
      onChange({ locality: value })
    }

    setLocalityError('')
    setShowSuggestions(false)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Only fetch if city is selected
    if (data.city && value.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(value, data.city!)
      }, 300) // 300ms debounce
    }
  }

  // Handle city change
  const handleCityChange = (value: string) => {
    onChange({ city: value })
    // Clear locality and place data when city changes
    if (data.locality || data.placeId) {
      onChange({
        city: value,
        locality: '',
        placeId: undefined,
        latitude: undefined,
        longitude: undefined,
        formattedAddress: undefined,
      })
      setInputValue('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = async (prediction: AutocompletePrediction) => {
    setInputValue(prediction.structured_formatting.main_text)
    setShowSuggestions(false)
    setSuggestions([])
    setLocalityError('')

    try {
      // Fetch place details to get coordinates and formatted address
      const placeDetails = await placesApi.getPlaceDetails(prediction.place_id)
      
      // Extract city from address components (try multiple city-related types)
      const cityComponent = placeDetails.address_components.find(
        (component) => component.types.includes('locality')
      ) || placeDetails.address_components.find(
        (component) => component.types.includes('administrative_area_level_2')
      ) || placeDetails.address_components.find(
        (component) => component.types.includes('administrative_area_level_1')
      )
      const extractedCity = cityComponent?.long_name || data.city || ''

      // Extract locality/area name (try multiple locality-related types)
      const localityComponent = placeDetails.address_components.find(
        (component) => component.types.includes('sublocality')
      ) || placeDetails.address_components.find(
        (component) => component.types.includes('sublocality_level_1')
      ) || placeDetails.address_components.find(
        (component) => component.types.includes('neighborhood')
      ) || placeDetails.address_components.find(
        (component) => component.types.includes('premise')
      )
      
      // Fallback: use display name or first part of formatted address
      const localityName = localityComponent?.long_name || 
                          placeDetails.name || 
                          placeDetails.formatted_address.split(',')[0]?.trim() ||
                          prediction.structured_formatting.main_text

      // Update listing data with all place information
      // This saves: place_id, latitude, longitude, formatted_address, city, locality
      onChange({
        locality: localityName,
        placeId: placeDetails.place_id,
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        formattedAddress: placeDetails.formatted_address,
        city: extractedCity || data.city, // Use extracted city or keep existing
      })

      if (onClearError) {
        onClearError('locality')
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
      setLocalityError('Failed to fetch location details. Please try again.')
      // Still set the basic info even if details fetch fails
      onChange({
        locality: prediction.structured_formatting.main_text,
        placeId: prediction.place_id,
      })
    }
  }

  const handleChange = (field: keyof Listing, value: any) => {
    onChange({ [field]: value })
  }

  return (
    <div>
      <h2 className="text-[1.2375rem] font-semibold text-gray-900 mb-1">Location</h2>
      <p className="text-[0.825rem] text-gray-600 mb-4">Where is the room located?</p>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {error}
        </div>
      )}

      {localityError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[0.825rem]">
          {localityError}
        </div>
      )}

      <div className="space-y-6">
        {/* City */}
        <div className="w-full">
          <CustomSelect
            label="City"
            value={data.city || ''}
            onValueChange={handleCityChange}
            placeholder="Select your city"
            options={cities.map(city => ({ value: city, label: city }))}
            error={error}
          />
        </div>

        {/* Locality with Autocomplete */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Locality / Area <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={suggestionsRef}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleLocalityInputChange(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0 && inputValue.trim().length >= 2) {
                  setShowSuggestions(true)
                }
              }}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300 text-stone-900 font-medium pl-12"
              placeholder={data.city ? "Start typing locality, area, or landmark..." : "Select a city first"}
              disabled={!data.city}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-mokogo-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    type="button"
                    onClick={() => handleSuggestionSelect(prediction)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {!data.city && (
            <p className="mt-1 text-xs text-gray-500">Please select a city first to search for localities</p>
          )}
          {data.city && !data.placeId && inputValue.trim().length > 0 && (
            <p className="mt-1 text-xs text-amber-600">
              Please select a location from the suggestions above
            </p>
          )}
        </div>

        {/* Society/Building Name */}
        <div className="w-full">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Society / Building Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <input
              type="text"
              value={data.societyName || ''}
              onChange={(e) => handleChange('societyName', e.target.value)}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md hover:border-orange-300 text-stone-900 font-medium pl-12"
              placeholder="e.g., Green Valley Apartments, Sunrise Towers"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Location
